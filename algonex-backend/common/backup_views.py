import os
import subprocess
import gzip
import tempfile
from datetime import datetime
try:
    import boto3
    from botocore.exceptions import ClientError
except ImportError:
    boto3 = None
    ClientError = Exception
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

# Session auth is intentionally scoped to these views only (the Django admin
# backups page calls them with a session cookie + X-CSRFToken). It must not be
# a global DRF default — see config/settings/base.py.
BACKUP_AUTH_CLASSES = [JWTAuthentication, SessionAuthentication]


def get_s3_client():
    bucket_name = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "algonex-media-storage")
    region_name = getattr(settings, "AWS_S3_REGION_NAME", "us-east-1")
    access_key = getattr(settings, "AWS_ACCESS_KEY_ID", None)
    secret_key = getattr(settings, "AWS_SECRET_ACCESS_KEY", None)

    if access_key and secret_key:
        return boto3.client(
            "s3",
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region_name,
        ), bucket_name
    return boto3.client("s3", region_name=region_name), bucket_name


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.is_superuser or getattr(request.user, "role", "") == "admin")
        )


class AdminBackupListView(APIView):
    authentication_classes = BACKUP_AUTH_CLASSES
    permission_classes = [IsAdminRole]

    def get(self, request):
        """List all backups stored in S3 bucket under backups/"""
        try:
            s3, bucket_name = get_s3_client()
            response = s3.list_objects_v2(Bucket=bucket_name, Prefix="backups/")
            
            backups = []
            for obj in response.get("Contents", []):
                key = obj["Key"]
                if key.endswith(".sql.gz") or key.endswith(".sql"):
                    backups.append({
                        "filename": key.replace("backups/", ""),
                        "full_key": key,
                        "size_bytes": obj["Size"],
                        "size_formatted": f"{round(obj['Size'] / 1024, 1)} KB" if obj["Size"] < 1024*1024 else f"{round(obj['Size'] / (1024*1024), 2)} MB",
                        "last_modified": obj["LastModified"].isoformat(),
                    })
            
            # Sort newest first
            backups.sort(key=lambda x: x["last_modified"], reverse=True)
            return Response({"status": "success", "backups": backups})
        except Exception as e:
            return Response(
                {"status": "error", "message": f"Failed to list S3 backups: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminBackupCreateView(APIView):
    authentication_classes = BACKUP_AUTH_CLASSES
    permission_classes = [IsAdminRole]

    def post(self, request):
        """Trigger an instant database backup and upload directly to S3"""
        db_conf = settings.DATABASES["default"]
        db_name = db_conf.get("NAME", "algonex")
        db_user = db_conf.get("USER", "postgres")
        db_password = db_conf.get("PASSWORD", "")
        db_host = db_conf.get("HOST", "localhost")
        db_port = str(db_conf.get("PORT", "5432"))

        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        filename = f"algonex_backup_{timestamp}.sql.gz"
        s3_key = f"backups/{filename}"

        env = os.environ.copy()
        if db_password:
            env["PGPASSWORD"] = db_password

        try:
            with tempfile.NamedTemporaryFile(suffix=".sql.gz", delete=False) as tmp_file:
                tmp_path = tmp_file.name

            # Run pg_dump and gzip. --clean --if-exists makes the dump DROP
            # existing objects first, so restoring over a non-empty database
            # actually replaces it instead of erroring on every CREATE.
            cmd = f"pg_dump --clean --if-exists -h {db_host} -p {db_port} -U {db_user} {db_name}"
            p_dump = subprocess.Popen(cmd, shell=True, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            dump_out, dump_err = p_dump.communicate()

            if p_dump.returncode != 0:
                return Response(
                    {"status": "error", "message": f"pg_dump failed: {dump_err.decode()}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            with gzip.open(tmp_path, "wb") as f:
                f.write(dump_out)

            s3, bucket_name = get_s3_client()
            s3.upload_file(tmp_path, bucket_name, s3_key)
            file_size = os.path.getsize(tmp_path)
            os.remove(tmp_path)

            return Response({
                "status": "success",
                "message": f"Backup created successfully and uploaded to S3!",
                "filename": filename,
                "size_formatted": f"{round(file_size / 1024, 1)} KB",
                "timestamp": timestamp,
            })
        except Exception as e:
            return Response(
                {"status": "error", "message": f"Backup failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminBackupRestoreView(APIView):
    authentication_classes = BACKUP_AUTH_CLASSES
    permission_classes = [IsAdminRole]

    def post(self, request):
        """Restore database from S3 backup after validating admin password"""
        password = request.data.get("password") or request.data.get("admin_password")
        filename = request.data.get("filename")

        if not password:
            return Response(
                {"status": "error", "message": "Admin password is required to confirm restore."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate password against requesting admin
        if not request.user.check_password(password):
            return Response(
                {"status": "error", "message": "Incorrect admin password. Restore aborted."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            s3, bucket_name = get_s3_client()

            # If filename not specified, pick latest
            if not filename:
                response = s3.list_objects_v2(Bucket=bucket_name, Prefix="backups/")
                contents = [obj for obj in response.get("Contents", []) if obj["Key"].endswith(".sql.gz") or obj["Key"].endswith(".sql")]
                if not contents:
                    return Response(
                        {"status": "error", "message": "No backups found in S3 bucket."},
                        status=status.HTTP_404_NOT_FOUND
                    )
                contents.sort(key=lambda x: x["LastModified"], reverse=True)
                s3_key = contents[0]["Key"]
                filename = s3_key.replace("backups/", "")
            else:
                s3_key = f"backups/{filename}" if not filename.startswith("backups/") else filename

            with tempfile.NamedTemporaryFile(suffix=".sql.gz", delete=False) as tmp_file:
                tmp_path = tmp_file.name

            # Download backup from S3
            s3.download_file(bucket_name, s3_key, tmp_path)

            # Decompress SQL (decide by the S3 key, not tmp_path — the temp file
            # always has a .gz suffix even for plain .sql backups)
            if s3_key.endswith(".gz"):
                with gzip.open(tmp_path, "rb") as f:
                    sql_content = f.read()
            else:
                with open(tmp_path, "rb") as f:
                    sql_content = f.read()

            os.remove(tmp_path)

            # Dumps made by a newer pg_dump carry SET parameters an older
            # server rejects (e.g. pg17's transaction_timeout on a pg16
            # server), and with ON_ERROR_STOP that aborts the whole restore.
            # Strip them so existing snapshots stay restorable.
            sql_content = b"\n".join(
                line for line in sql_content.splitlines()
                if not line.strip().startswith(b"SET transaction_timeout")
            )

            # Restore into PostgreSQL
            db_conf = settings.DATABASES["default"]
            db_name = db_conf.get("NAME", "algonex")
            db_user = db_conf.get("USER", "postgres")
            db_password = db_conf.get("PASSWORD", "")
            db_host = db_conf.get("HOST", "localhost")
            db_port = str(db_conf.get("PORT", "5432"))

            env = os.environ.copy()
            if db_password:
                env["PGPASSWORD"] = db_password

            # Safety net: snapshot the CURRENT database to S3 before overwriting
            # it, so a bad restore is itself recoverable. Abort if this fails.
            safety_ts = datetime.now().strftime("%Y-%m-%d_%H%M%S")
            safety_key = f"backups/pre_restore_{safety_ts}.sql.gz"
            dump_cmd = f"pg_dump --clean --if-exists -h {db_host} -p {db_port} -U {db_user} {db_name}"
            p_safety = subprocess.Popen(dump_cmd, shell=True, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            safety_out, safety_err = p_safety.communicate()
            if p_safety.returncode != 0:
                return Response(
                    {
                        "status": "error",
                        "message": f"Aborted: could not take a pre-restore safety snapshot ({safety_err.decode()[:500]})",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            with tempfile.NamedTemporaryFile(suffix=".sql.gz", delete=False) as safety_file:
                safety_path = safety_file.name
            with gzip.open(safety_path, "wb") as f:
                f.write(safety_out)
            s3.upload_file(safety_path, bucket_name, safety_key)
            os.remove(safety_path)

            # A restore means "overwrite the database with the snapshot", and
            # older snapshots carry no DROP statements — so reset the schema
            # first. The pre-restore safety snapshot above is the way back.
            cmd = f"psql -v ON_ERROR_STOP=1 -h {db_host} -p {db_port} -U {db_user} -d {db_name}"
            reset_sql = (
                "DROP SCHEMA public CASCADE; CREATE SCHEMA public; "
                f"GRANT ALL ON SCHEMA public TO \"{db_user}\"; "
                "GRANT ALL ON SCHEMA public TO public;"
            ).encode()
            p_reset = subprocess.Popen(cmd, shell=True, env=env, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            _, reset_err = p_reset.communicate(input=reset_sql)
            if p_reset.returncode != 0:
                return Response(
                    {
                        "status": "error",
                        "message": f"Restore aborted before loading data (schema reset failed): {reset_err.decode()[:1000]}",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            p_restore = subprocess.Popen(cmd, shell=True, env=env, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            restore_out, restore_err = p_restore.communicate(input=sql_content)

            if p_restore.returncode != 0:
                return Response(
                    {
                        "status": "error",
                        "message": f"Restore FAILED (psql exit {p_restore.returncode}): {restore_err.decode()[:2000]}",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            return Response({
                "status": "success",
                "message": f"Database successfully restored from '{filename}'! (pre-restore state saved as {safety_key})",
                "restored_file": filename,
                "safety_snapshot": safety_key,
            })
        except Exception as e:
            return Response(
                {"status": "error", "message": f"Restore failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


def admin_system_backup_page_view(request):
    """Render Unfold Admin page for S3 Backups & Restore."""
    from django.shortcuts import render
    from django.contrib import admin
    from django.contrib.admin.views.decorators import staff_member_required

    if not (request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser or getattr(request.user, "role", "") == "admin")):
        from django.core.exceptions import PermissionDenied
        raise PermissionDenied

    backups = []
    total_bytes = 0
    s3_connected = True
    error_message = None
    latest_dt = None
    bucket_name = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "algonex-media-storage")

    try:
        # Inside the try: boto3 may be missing or misconfigured, and that must
        # degrade to an error banner, not a 500 on the whole admin page.
        s3, bucket_name = get_s3_client()
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix="backups/")
        for obj in response.get("Contents", []):
            key = obj["Key"]
            if key.endswith(".sql.gz") or key.endswith(".sql"):
                size = obj["Size"]
                total_bytes += size
                if latest_dt is None or obj["LastModified"] > latest_dt:
                    latest_dt = obj["LastModified"]
                backups.append({
                    "filename": key.replace("backups/", ""),
                    "full_key": key,
                    "size_bytes": size,
                    "size_formatted": f"{round(size / 1024, 1)} KB" if size < 1024*1024 else f"{round(size / (1024*1024), 2)} MB",
                    "last_modified": obj["LastModified"].strftime("%Y-%m-%d %H:%M:%S UTC"),
                })
        # Sort latest first
        backups.sort(key=lambda b: b["last_modified"], reverse=True)
    except Exception as e:
        s3_connected = False
        error_message = str(e)

    # The nightly cron runs at 02:00; anything older than 26h means it has
    # silently stopped and someone should look at the EC2 crontab/log.
    from datetime import timedelta, timezone as dt_timezone
    backup_stale = bool(
        s3_connected
        and (latest_dt is None or datetime.now(dt_timezone.utc) - latest_dt > timedelta(hours=26))
    )

    context = admin.site.each_context(request)
    context.update({
        "backup_stale": backup_stale,
        "title": "S3 Database Backups & Restore",
        "backups": backups,
        "backup_count": len(backups),
        "total_storage_formatted": f"{round(total_bytes / 1024, 1)} KB" if total_bytes < 1024*1024 else f"{round(total_bytes / (1024*1024), 2)} MB",
        "latest_backup": backups[0]["last_modified"] if backups else "Never",
        "bucket_name": bucket_name,
        "s3_connected": s3_connected,
        "error_message": error_message,
    })
    return render(request, "admin/system/backups.html", context)

