"""
Shared settings for all environments.
"""
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Admin notifications
ADMINS = [("Algonex Admin", "solutions@algonex.co.in"), ("Sai Kumar", "pappakasaikumar@gmail.com")]
DEFAULT_FROM_EMAIL = "Algonex <solutions@algonex.co.in>"

INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.import_export",
    "import_export",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Third party
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "django_filters",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.github",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    # Local apps
    "common",
    "accounts",
    "courses",
    "events",
    "careers",
    "portfolio",
    "contactform",
    "signin",
    "programs",
    "showcase",
    "buddy",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
MEDIA_URL = "/media/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Custom user model
AUTH_USER_MODEL = "accounts.User"

# Site framework (required by allauth)
SITE_ID = 1

# REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
    ],
    "DEFAULT_PAGINATION_CLASS": "common.pagination.StandardPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "EXCEPTION_HANDLER": "common.exception_handler.custom_exception_handler",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "60/minute",
        "user": "300/minute",
        "registration": "60/minute",
        "auth_check": "30/minute",
        "dj_rest_auth": "60/minute",
    },

}

# Simple JWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# dj-rest-auth
REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": None,
    "JWT_AUTH_REFRESH_COOKIE": None,
    "JWT_AUTH_HTTPONLY": False,
    "USER_DETAILS_SERIALIZER": "accounts.serializers.UserDetailSerializer",
    "REGISTER_SERIALIZER": "accounts.serializers.CustomRegisterSerializer",
}

# django-allauth
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_VERIFICATION = "none"
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Email (console backend for dev, override in production.py)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Frontend URL for password setup links
FRONTEND_URL = "http://localhost:5173"

# django-unfold admin theme
UNFOLD = {
    "SITE_TITLE": "Algonex",
    "SITE_HEADER": "Algonex Admin",
    "SITE_ICON": lambda request: None,
    "DASHBOARD_CALLBACK": "common.admin_site.dashboard_callback",
    "STYLES": [
        lambda request: "/static/css/custom_admin.css",
    ],
    "SIDEBAR": {
        "show_search": True,
        "navigation": [
            {
                "title": "Dashboard",
                "icon": "dashboard",
                "items": [
                    {"title": "Dashboard", "link": "/admin/", "icon": "dashboard"},
                ],
            },
            {
                "title": "Courses",
                "icon": "school",
                "items": [
                    {"title": "Courses", "link": "/admin/courses/course/", "icon": "menu_book"},
                    {"title": "Enrollments", "link": "/admin/courses/enrollment/", "icon": "how_to_reg"},
                    {"title": "Communication", "link": "/admin/courses/communication/", "icon": "mail"},
                    {"title": "Tags", "link": "/admin/courses/tag/", "icon": "psychology"},
                    {"title": "Student Outcomes", "link": "/admin/courses/studentoutcome/", "icon": "emoji_events"},
                    {"title": "Feedback & Reviews", "link": "/admin/courses/feedback/", "icon": "rate_review"},
                    {"title": "Certificates", "link": "/admin/courses/certificate/", "icon": "workspace_premium"},
                ],
            },
            {
                "title": "Events",
                "icon": "event",
                "items": [
                    {"title": "Events", "link": "/admin/events/event/", "icon": "celebration"},
                    {"title": "Registrations", "link": "/admin/events/registration/", "icon": "app_registration"},
                ],
            },
            {
                "title": "Users & Signups",
                "icon": "people",
                "items": [
                    {"title": "Users", "link": "/admin/accounts/user/", "icon": "person"},
                    {"title": "Student Registrations", "link": "/admin/signin/studentregistration/", "icon": "assignment_ind"},
                    {"title": "Payments", "link": "/admin/signin/payment/", "icon": "payments"},
                ],
            },
            {
                "title": "Content",
                "icon": "article",
                "items": [
                    {"title": "Programs", "link": "/admin/programs/program/", "icon": "work"},
                    {"title": "Jobs", "link": "/admin/careers/job/", "icon": "business_center"},
                    {"title": "Applications", "link": "/admin/careers/application/", "icon": "description"},
                    {"title": "Case Studies", "link": "/admin/portfolio/casestudy/", "icon": "cases"},
                    {"title": "Media", "link": "/admin/common/media/", "icon": "perm_media"},
                    {"title": "Gallery", "link": "/admin/common/gallery/", "icon": "photo_library"},
                ],
            },
            {
                "title": "Showcase",
                "icon": "star",
                "items": [
                    {"title": "Student Projects", "link": "/admin/showcase/studentproject/", "icon": "code"},
                ],
            },
            {
                "title": "Site Config",
                "icon": "settings",
                "items": [
                    {"title": "Site Config", "link": "/admin/common/siteconfig/", "icon": "tune"},
                    {"title": "Contact Submissions", "link": "/admin/contactform/contactform/", "icon": "mail"},
                    {"title": "S3 Backups & Restore", "link": "/admin/system/backups/", "icon": "cloud_sync"},
                ],
            },
        ],
    },
}

# ---------------------------------------------------------------------------
# Buddy AI Chatbot
# ---------------------------------------------------------------------------
# Switch providers by setting BUDDY_LLM_PROVIDER in environment or a
# child settings file. No code changes needed.
# Supported values: "gemini" | "openai" | "anthropic"
BUDDY_LLM_PROVIDER = "gemini"          # default provider
BUDDY_LLM_MODEL = "gemini-2.5-flash"  # override model if needed
