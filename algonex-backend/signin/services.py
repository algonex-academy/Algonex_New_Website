from django.contrib.auth import get_user_model
from django.db import IntegrityError
from .models import StudentRegistration
from .exceptions import UserNotFound, TermsNotAgreed

User = get_user_model()


def register_step1(*, first_name, last_name, email, phone, password=None):
    """Create or find a user by email. Sets password only for new users."""
    try:
        user = User.objects.get(email=email)
        # SECURITY: never set a password on an already-existing account from
        # this unauthenticated endpoint — doing so would let anyone who knows
        # the email hijack password-less (imported/OAuth) accounts. First-time
        # passwords must go through the setup-email token link or OTP reset.
        return {
            "is_new": False,
            "has_password": user.has_usable_password(),
        }
    except User.DoesNotExist:
        pass

    # Create new user
    # Use savepoints for PostgreSQL compatibility on IntegrityError
    from django.db import transaction
    username = email.split("@")[0]
    user = None
    for suffix in [""] + [str(i) for i in range(1, 100)]:
        candidate = f"{username}{suffix}"
        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name,
                    phone=phone,
                    username=candidate,
                )
            break
        except IntegrityError:
            continue

    if user is None:
        raise ValueError(f"Could not generate unique username for {email}")

    return {"is_new": True}


def register_step2(*, email, program_slug=None, terms_agreed, **profile_data):
    """Create or update StudentRegistration profile for the user."""
    if not terms_agreed:
        raise TermsNotAgreed()

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        raise UserNotFound()

    # Resolve program if slug provided
    program = None
    if program_slug:
        from programs.models import Program
        program = Program.objects.filter(slug=program_slug, is_published=True).first()

    profile_data["course"] = program
    profile_data["terms_agreed"] = terms_agreed

    if "college" in profile_data:
        profile_data["college_name"] = profile_data.pop("college")

    if "interest_category" in profile_data:
        profile_data["course_selected"] = profile_data.pop("interest_category")

    profile_data.pop("specific_interests", None)

    StudentRegistration.objects.update_or_create(
        user=user,
        defaults=profile_data,
    )

    return {"registered": True}
