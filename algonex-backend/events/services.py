from django.db import transaction
from .models import Event, Registration
from .exceptions import EventNotOpen, AlreadyRegistered


@transaction.atomic
def register_for_event(*, user, event):
    """Register a user for an event. Auto-confirm or waitlist based on capacity.
    Wrapped in atomic transaction to prevent race conditions on capacity check.
    """
    # Lock the event row to prevent concurrent over-booking
    event = Event.objects.select_for_update().get(pk=event.pk)

    if event.status != "upcoming":
        raise EventNotOpen()

    if not event.is_published:
        raise EventNotOpen()

    existing = Registration.objects.filter(event=event, user=user).first()
    if existing and existing.status != "cancelled":
        raise AlreadyRegistered()

    status = "confirmed" if event.spots_left > 0 else "waitlisted"
    if existing:
        # Reuse the cancelled row — unique_together('event', 'user') forbids a new one
        existing.status = status
        existing.save()
        return existing
    return Registration.objects.create(event=event, user=user, status=status)


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
