from django.db import transaction
from .models import Event, Registration
from .exceptions import EventNotOpen, AlreadyRegistered


@transaction.atomic
def register_for_event(*, user=None, full_name="", email="", phone="", college_name="", branch="", year_of_study="", roll_no="", student_id="", github_url="", custom_answers=None, event):
    """Register a user or guest for an event. Auto-confirm or waitlist based on capacity.
    Wrapped in atomic transaction to prevent race conditions on capacity check.
    """
    if custom_answers is None:
        custom_answers = {}

    event = Event.objects.select_for_update().get(pk=event.pk)

    if event.status != "upcoming":
        raise EventNotOpen()

    if not event.is_published:
        raise EventNotOpen()

    user_obj = user if (user and user.is_authenticated) else None
    check_email = (email or (user_obj.email if user_obj else "")).strip().lower()

    if user_obj:
        existing = Registration.objects.filter(
            event=event, user=user_obj
        ).exclude(status="cancelled").first()
    elif check_email:
        existing = Registration.objects.filter(
            event=event, email__iexact=check_email
        ).exclude(status="cancelled").first()
    else:
        existing = None

    if existing:
        raise AlreadyRegistered()

    status = "confirmed" if event.spots_left > 0 else "waitlisted"

    if user_obj:
        if not full_name:
            full_name = f"{user_obj.first_name} {user_obj.last_name}".strip() or user_obj.username
        if not email:
            email = user_obj.email
        if not phone and hasattr(user_obj, "phone"):
            phone = user_obj.phone

    return Registration.objects.create(
        event=event,
        user=user_obj,
        full_name=full_name,
        email=email,
        phone=phone,
        college_name=college_name,
        branch=branch,
        year_of_study=year_of_study,
        roll_no=roll_no,
        student_id=student_id,
        github_url=github_url,
        custom_answers=custom_answers,
        status=status
    )


@transaction.atomic
def cancel_registration(*, registration):
    """Cancel a registration and promote the next waitlisted person.
    Atomic to ensure promotion is consistent.
    """
    registration.status = "cancelled"
    registration.save()

    # Promote oldest waitlisted
    next_in_line = Registration.objects.filter(
        event=registration.event, status="waitlisted"
    ).order_by("registered_at").first()

    if next_in_line:
        next_in_line.status = "confirmed"
        next_in_line.save()
        return next_in_line

    return None
