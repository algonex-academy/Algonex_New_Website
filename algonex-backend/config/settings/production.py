"""
Production settings — read secrets from environment.
"""
import os
from .base import *  # noqa: F401,F403

DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

raw_hosts = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")
ALLOWED_HOSTS = [h.strip() for h in raw_hosts if h.strip()]
for default_host in ["algonex.co.in", "www.algonex.co.in", ".algonex.co.in", "localhost", "127.0.0.1", "backend"]:
    if default_host not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(default_host)

raw_origins = os.environ.get("CSRF_TRUSTED_ORIGINS", "https://algonex.co.in,https://www.algonex.co.in").split(",")
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in raw_origins if origin.strip()]
for default_origin in ["https://algonex.co.in", "https://www.algonex.co.in"]:
    if default_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(default_origin)

USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True

_database_url = os.environ.get("DATABASE_URL")
if _database_url and _database_url.strip():
    import re
    import urllib.parse
    clean_url = _database_url.strip().strip("'\"")
    m = re.match(r"^(?:postgres(?:ql)?://)?(?:(?P<user>[^:@]+)(?::(?P<password>.*))?@)?(?P<host>[^:/]+)(?::(?P<port>\d+))?(?:/(?P<name>[^?]+))?(?:\?(?P<query>.*))?$", clean_url)
    if m:
        gd = m.groupdict()
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": (gd["name"] or "postgres").lstrip("/"),
                "USER": urllib.parse.unquote(gd["user"] or "postgres"),
                "PASSWORD": urllib.parse.unquote(gd["password"] or ""),
                "HOST": gd["host"] or "localhost",
                "PORT": str(gd["port"] or "5432"),
                "CONN_MAX_AGE": int(os.environ.get("DB_CONN_MAX_AGE", 600)),
                "OPTIONS": {
                    "sslmode": os.environ.get("DB_SSLMODE", "require"),
                },
            }
        }
    else:
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": os.environ.get("DB_NAME", "algonex"),
                "USER": os.environ.get("DB_USER", "postgres"),
                "PASSWORD": os.environ.get("DB_PASSWORD", ""),
                "HOST": os.environ.get("DB_HOST", "localhost"),
                "PORT": os.environ.get("DB_PORT", "5432"),
                "CONN_MAX_AGE": int(os.environ.get("DB_CONN_MAX_AGE", 600)),
                "OPTIONS": {
                    "sslmode": os.environ.get("DB_SSLMODE", "prefer"),
                },
            }
        }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get("DB_NAME", "algonex"),
            "USER": os.environ.get("DB_USER", "postgres"),
            "PASSWORD": os.environ.get("DB_PASSWORD", ""),
            "HOST": os.environ.get("DB_HOST", "localhost"),
            "PORT": os.environ.get("DB_PORT", "5432"),
            "CONN_MAX_AGE": int(os.environ.get("DB_CONN_MAX_AGE", 600)),
            "OPTIONS": {
                "sslmode": os.environ.get("DB_SSLMODE", "prefer"),
            },
        }
    }

# S3 Storage or Local Storage
USE_S3 = os.environ.get("USE_S3", "false").lower() == "true" or bool(os.environ.get("AWS_STORAGE_BUCKET_NAME"))

if USE_S3:
    INSTALLED_APPS = list(INSTALLED_APPS) + ["storages"]
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME", "algonex-media-storage")
    AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", "us-east-1")
    AWS_S3_CUSTOM_DOMAIN = os.environ.get("AWS_S3_CUSTOM_DOMAIN", f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com")
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = False

    MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/media/"
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3.S3Storage",
            "OPTIONS": {
                "location": "media",
            },
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }
else:
    MEDIA_ROOT = BASE_DIR / "media"

STATIC_ROOT = BASE_DIR / "staticfiles"

CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")

SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "true").lower() == "true"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://algonex.co.in")

