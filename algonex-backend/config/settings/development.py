"""
Development settings — DEBUG on, console email, PostgreSQL.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from .base import *  # noqa: F401,F403

# Load .env from the project root (algonex-backend/.env)
# Load .env from backend directory or project root
_env_backend = Path(__file__).resolve().parent.parent.parent / ".env"
_env_root = Path(__file__).resolve().parent.parent.parent.parent / ".env"
if _env_backend.exists():
    load_dotenv(_env_backend)
if _env_root.exists():
    load_dotenv(_env_root)

DEBUG = True
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-dev-only-key-change-in-production")

ALLOWED_HOSTS = ["*"]

# Database configuration: supports DATABASE_URL (Supabase URI), discrete DB_* vars, or SQLite fallback
_database_url = os.environ.get("DATABASE_URL")
_db_engine = os.environ.get("DB_ENGINE")
_db_host = os.environ.get("DB_HOST")

if _database_url and _database_url.strip():
    import re
    import urllib.parse
    # Clean possible whitespace or quotes
    clean_url = _database_url.strip().strip("'\"")
    # Parse connection string with regex fallback for robust special-character support
    m = re.match(r"^(?:postgres(?:ql)?://)?(?:(?P<user>[^:@]+)(?::(?P<password>.*))?@)?(?P<host>[^:/]+)(?::(?P<port>\d+))?(?:/(?P<name>[^?]+))?(?:\?(?P<query>.*))?$", clean_url)
    if m:
        gd = m.groupdict()
        _db_user = urllib.parse.unquote(gd["user"] or "postgres")
        _db_pass = urllib.parse.unquote(gd["password"] or "")
        _db_host = gd["host"] or "localhost"
        _db_port = str(gd["port"] or "5432")
        _db_name = (gd["name"] or "postgres").lstrip("/")
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": _db_name,
                "USER": _db_user,
                "PASSWORD": _db_pass,
                "HOST": _db_host,
                "PORT": _db_port,
                "CONN_MAX_AGE": int(os.environ.get("DB_CONN_MAX_AGE", 600)),
                "OPTIONS": {
                    "sslmode": os.environ.get("DB_SSLMODE", "require"),
                },
            }
        }
    else:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured("Invalid DATABASE_URL format in your .env file.")
else:
    # Look for discrete environment variables
    _db_name = os.environ.get("DB_NAME")
    _db_user = os.environ.get("DB_USER")
    _db_pass = os.environ.get("DB_PASSWORD")
    _db_host = os.environ.get("DB_HOST")
    _db_port = os.environ.get("DB_PORT", "5432")

    if _db_name and _db_user and _db_host:
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
                "NAME": _db_name,
                "USER": _db_user,
                "PASSWORD": _db_pass or "",
                "HOST": _db_host,
                "PORT": _db_port,
                "CONN_MAX_AGE": int(os.environ.get("DB_CONN_MAX_AGE", 600)),
                "OPTIONS": {
                    "sslmode": os.environ.get("DB_SSLMODE", "require"),
                },
            }
        }
    else:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured(
            "SQLite is disabled. You must configure PostgreSQL / Supabase connection in your .env file "
            "using either DATABASE_URL or discrete variables (DB_NAME, DB_USER, DB_HOST, DB_PASSWORD)."
        )

MEDIA_ROOT = BASE_DIR / "media"

# CORS — allow Vite dev server
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Dynamic email backend (SMTP if configured in env, fallback to console)
if os.environ.get("EMAIL_HOST_USER"):
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
    EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
