import os
import subprocess
import gzip
import tempfile
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


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

            # Run pg_dump and gzip
            cmd = f"pg_dump -h {db_host} -p {db_port} -U {db_user} {db_name}"
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

            # Decompress SQL
            if tmp_path.endswith(".gz") or s3_key.endswith(".gz"):
                with gzip.open(tmp_path, "rb") as f:
                    sql_content = f.read()
            else:
                with open(tmp_path, "rb") as f:
                    sql_content = f.read()

            os.remove(tmp_path)

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

            cmd = f"psql -h {db_host} -p {db_port} -U {db_user} -d {db_name}"
            p_restore = subprocess.Popen(cmd, shell=True, env=env, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            restore_out, restore_err = p_restore.communicate(input=sql_content)

            return Response({
                "status": "success",
                "message": f"Database successfully restored from '{filename}'!",
                "restored_file": filename,
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

    s3, bucket_name = get_s3_client()
    backups = []
    total_bytes = 0
    s3_connected = True
    error_message = None

    try:
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix="backups/")
        for obj in response.get("Contents", []):
            key = obj["Key"]
            if key.endswith(".sql.gz") or key.endswith(".sql"):
                size = obj["Size"]
                total_bytes += size
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

    context = admin.site.each_context(request)
    context.update({
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

