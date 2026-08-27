"""
Enable Row Level Security (RLS) on ALL Django-managed tables in the public schema.

WHY: Supabase exposes the `public` schema via its PostgREST API by default.
Without RLS, anyone with the publishable anon key can read/write every table
directly — bypassing Django's authentication and permissions entirely.

HOW IT WORKS:
- Django connects as the `postgres` superuser, which BYPASSES RLS automatically.
  So all Django ORM queries, migrations, and admin operations continue to work
  exactly as before.
- The Supabase `anon` and `authenticated` roles (used by the JS SDK / REST API)
  will be BLOCKED because RLS is enabled but NO policies grant them access.

This is the standard approach for Django + Supabase projects where Django is the
sole data access layer and you don't want Supabase client SDKs to touch the DB.
"""

from django.db import migrations


# Every table flagged by the Supabase linter
TABLES = [
    # Django framework tables
    "django_migrations",
    "django_content_type",
    "django_admin_log",
    "django_session",
    "django_site",
    "auth_permission",
    "auth_group",
    "auth_group_permissions",
    # Accounts / Auth
    "accounts_user",
    "accounts_user_groups",
    "accounts_user_user_permissions",
    "account_emailaddress",
    "account_emailconfirmation",
    "accounts_passwordresetotp",
    "authtoken_token",
    # Social Auth
    "socialaccount_socialaccount",
    "socialaccount_socialapp",
    "socialaccount_socialapp_sites",
    "socialaccount_socialtoken",
    # Courses
    "courses_course",
    "courses_course_skills",
    "courses_tag",
    "courses_enrollment",
    "courses_studentoutcome",
    "courses_certificate",
    "courses_certificate_worked_tools",
    "courses_faq",
    "courses_feedback",
    "courses_emaillog",
    # Events
    "events_event",
    # Careers
    "careers_job",
    "careers_job_tags",
    "careers_application",
    # Portfolio & Showcase
    "portfolio_casestudy",
    "portfolio_casestudy_tech_tags",
    "showcase_studentproject",
    "showcase_studentproject_tech_tags",
    # Programs
    "programs_campuscrewregistration",
    # Signin / Payments
    "signin_studentregistration",
    "signin_payment",
    # Common
    "common_media",
    "common_siteconfig",
    "common_gallery",
    # Contact
    "contactform_contactform",
]


def enable_rls(apps, schema_editor):
    """Enable RLS on all tables. No policies = deny all via PostgREST."""
    for table in TABLES:
        schema_editor.execute(
            f'ALTER TABLE IF EXISTS public."{table}" ENABLE ROW LEVEL SECURITY;'
        )


def disable_rls(apps, schema_editor):
    """Reverse: disable RLS on all tables (restores original open state)."""
    for table in TABLES:
        schema_editor.execute(
            f'ALTER TABLE IF EXISTS public."{table}" DISABLE ROW LEVEL SECURITY;'
        )


class Migration(migrations.Migration):

    dependencies = [
        ("common", "0008_rename_adminupload_gallery_alter_gallery_options"),
    ]

    operations = [
        migrations.RunSQL(
            sql=[
                f'ALTER TABLE IF EXISTS public."{table}" ENABLE ROW LEVEL SECURITY;'
                for table in TABLES
            ],
            reverse_sql=[
                f'ALTER TABLE IF EXISTS public."{table}" DISABLE ROW LEVEL SECURITY;'
                for table in TABLES
            ],
        ),
    ]
