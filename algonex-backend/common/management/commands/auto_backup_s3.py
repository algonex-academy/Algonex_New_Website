import os
import gzip
import subprocess
from datetime import datetime, timezone, timedelta
import boto3
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Automated daily S3 backup with 30-day retention cleanup."

    def add_arguments(self, parser):
        parser.add_argument(
            "--retention-days",
            type=int,
            default=30,
            help="Number of days to retain backups before deleting (default: 30 days)",
        )

    def handle(self, *args, **options):
        retention_days = options["retention_days"]
        self.stdout.write(f"⏳ Starting automated S3 database backup (retention: {retention_days} days)...")

        # 1. Database connection settings
        db_conf = settings.DATABASES["default"]
        db_name = db_conf.get("NAME", "algonex")
        db_user = db_conf.get("USER", "postgres")
        db_password = db_conf.get("PASSWORD", "")
        db_host = db_conf.get("HOST", "localhost")
        db_port = str(db_conf.get("PORT", "5432"))

        env = os.environ.copy()
        if db_password:
            env["PGPASSWORD"] = db_password

        # 2. Run pg_dump
        cmd = f"pg_dump -h {db_host} -p {db_port} -U {db_user} {db_name}"
        p = subprocess.Popen(cmd, shell=True, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        dump_out, dump_err = p.communicate()

        if p.returncode != 0:
            err_msg = dump_err.decode() if dump_err else "Unknown dump error"
            self.stderr.write(self.style.ERROR(f"❌ pg_dump failed: {err_msg}"))
            return

        # 3. Compress snapshot
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"algonex_auto_backup_{timestamp}.sql.gz"
        local_gz = f"/tmp/{backup_filename}"

        with gzip.open(local_gz, "wb") as f:
            f.write(dump_out)

        file_size_kb = round(os.path.getsize(local_gz) / 1024, 1)

        # 4. Upload to S3
        bucket_name = getattr(settings, "AWS_STORAGE_BUCKET_NAME", "algonex-media-storage")
        region_name = getattr(settings, "AWS_S3_REGION_NAME", "us-east-1")
        access_key = getattr(settings, "AWS_ACCESS_KEY_ID", None)
        secret_key = getattr(settings, "AWS_SECRET_ACCESS_KEY", None)

        if access_key and secret_key:
            s3 = boto3.client(
                "s3",
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
                region_name=region_name,
            )
        else:
            s3 = boto3.client("s3", region_name=region_name)

        s3_key = f"backups/{backup_filename}"
        s3.upload_file(local_gz, bucket_name, s3_key)
        os.remove(local_gz)

        self.stdout.write(self.style.SUCCESS(
            f"✅ Uploaded snapshot: s3://{bucket_name}/{s3_key} ({file_size_kb} KB)"
        ))

        # 5. Cleanup snapshots older than retention_days (30 days)
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=retention_days)
        self.stdout.write(f"🧹 Scanning for snapshots older than {cutoff_date.strftime('%Y-%m-%d %H:%M:%S UTC')}...")

        deleted_count = 0
        try:
            response = s3.list_objects_v2(Bucket=bucket_name, Prefix="backups/")
            for obj in response.get("Contents", []):
                key = obj["Key"]
                # Don't delete initial seed snapshots, only auto backups or older manual ones
                if key.endswith(".sql.gz") or key.endswith(".sql"):
                    last_modified = obj["LastModified"]
                    if last_modified < cutoff_date and not key.endswith("initial_students.sql.gz"):
                        s3.delete_object(Bucket=bucket_name, Key=key)
                        self.stdout.write(f"   🗑️ Deleted expired snapshot: {key} (Created: {last_modified})")
                        deleted_count += 1
        except Exception as e:
            self.stderr.write(f"⚠️ Warning during retention cleanup: {str(e)}")

        self.stdout.write(self.style.SUCCESS(
            f"🎉 Backup & Retention complete! 1 new snapshot created, {deleted_count} expired snapshots purged."
        ))
