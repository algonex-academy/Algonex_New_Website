"""
Development settings — DEBUG on, console email, PostgreSQL.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from .base import *  # noqa: F401,F403

# Load .env from the project root (algonex-backend/.env)
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

DEBUG = True
SECRET_KEY = "django-insecure-dev-only-key-change-in-production"

ALLOWED_HOSTS = ["*"]

# Default to SQLite for local dev. Set DB_ENGINE=postgresql + other DB_ vars to use PostgreSQL.
_db_engine = os.environ.get("DB_ENGINE", "sqlite3")

if _db_engine == "postgresql":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get("DB_NAME", "algonex"),
            "USER": os.environ.get("DB_USER", "postgres"),
            "PASSWORD": os.environ.get("DB_PASSWORD", "postgres"),
            "HOST": os.environ.get("DB_HOST", "localhost"),
            "PORT": os.environ.get("DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

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

# OAuth redirect URI — must exactly match the redirect_uri the SPA authorizes
# with (window.location.origin + "/auth/callback").
OAUTH_CALLBACK_URL = "http://localhost:5173/auth/callback"
