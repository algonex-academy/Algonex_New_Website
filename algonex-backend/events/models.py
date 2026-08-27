from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.utils import timezone
from common.mixins import TimestampMixin, SlugMixin


class Event(TimestampMixin, SlugMixin, models.Model):
    """An event (workshop, webinar, hackathon, meetup) with capacity management."""

    TYPE_CHOICES = [
        ("workshop", "Workshop"),
        ("webinar", "Webinar"),
        ("hackathon", "Hackathon"),
        ("meetup", "Meetup"),
    ]

    title = models.CharField(max_length=255)
    summary = models.CharField(max_length=300, blank=True, help_text="Short plain-text description for cards")
    description = models.TextField(help_text="Full description, supports Markdown")
    image = models.ImageField(upload_to="events/", blank=True, null=True)
    event_type = models.CharField(max_length=20, choices=TYPE_CHOICES, db_index=True)
    location = models.CharField(max_length=255)
    meeting_link = models.URLField(blank=True, help_text="Visible only to confirmed registrants")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    capacity = models.PositiveIntegerField()
    is_published = models.BooleanField(default=True)
    speaker = models.CharField(max_length=255, blank=True, help_text="Speaker or host name/title")
    time_range = models.CharField(max_length=100, blank=True, help_text="Custom display time e.g. 10:00 AM - 4:00 PM")
    highlights = models.JSONField(default=list, blank=True, help_text="List of event highlights/takeaways strings")
    
    FIELD_MODE_CHOICES = [
        ("required", "Required (Mandatory)"),
        ("optional", "Optional (Non-Mandatory)"),
        ("hidden", "Hidden (Do Not Show)"),
    ]

    form_phone_mode = models.CharField(max_length=15, choices=FIELD_MODE_CHOICES, default="required", verbose_name="Phone Number Field")
    form_college_mode = models.CharField(max_length=15, choices=FIELD_MODE_CHOICES, default="optional", verbose_name="College / Organization Field")
    form_branch_mode = models.CharField(max_length=15, choices=FIELD_MODE_CHOICES, default="hidden", verbose_name="Branch / Department Field")
    form_year_mode = models.CharField(max_length=15, choices=FIELD_MODE_CHOICES, default="hidden", verbose_name="Year of Study Field")
    form_roll_no_mode = models.CharField(max_length=15, choices=FIELD_MODE_CHOICES, default="hidden", verbose_name="Student Roll No / USN Field")
    form_student_id_mode = models.CharField(max_length=15, choices=FIELD_MODE_CHOICES, default="hidden", verbose_name="Student ID / Algonex ID Field")
    form_github_mode = models.CharField(max_length=15, choices=FIELD_MODE_CHOICES, default="hidden", verbose_name="GitHub / Portfolio Link Field")

    registration_form_schema = models.JSONField(
        default=list,
        blank=True,
        help_text="Custom Google Forms-like fields schema. List of objects e.g. [{'id': 'tshirt', 'label': 'T-Shirt Size', 'type': 'select', 'options': ['S', 'M', 'L', 'XL'], 'required': True}]"
    )
    media = GenericRelation("common.Media")



    # SlugMixin uses `name` or `title` — we have `title`

    class Meta:
        ordering = ["start_date"]

    def __str__(self):
        return self.title

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValidationError("End date must be after start date.")

    @property
    def spots_left(self):
        confirmed = self.registrations.filter(status="confirmed").count()
        return max(0, self.capacity - confirmed)

    @property
    def is_full(self):
        return self.spots_left <= 0

    @property
    def status(self):
        now = timezone.now()
        if now < self.start_date:
            return "upcoming"
        if now <= self.end_date:
            return "ongoing"
        return "past"


class Registration(models.Model):
    """Tracks a user's or guest's registration for an event."""

    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("waitlisted", "Waitlisted"),
        ("cancelled", "Cancelled"),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="registrations")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="event_registrations"
    )
    full_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True, db_index=True)
    phone = models.CharField(max_length=30, blank=True)
    college_name = models.CharField(max_length=200, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    year_of_study = models.CharField(max_length=50, blank=True)
    roll_no = models.CharField(max_length=50, blank=True)
    student_id = models.CharField(max_length=50, blank=True, verbose_name="Student ID / Algonex ID")
    github_url = models.CharField(max_length=255, blank=True)
    custom_answers = models.JSONField(
        default=dict,
        blank=True,
        help_text="Custom Google Forms-like responses submitted by the registrant"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["registered_at"]

    def __str__(self):
        identifier = self.user.email if self.user else (self.email or self.full_name or "Guest")
        return f"{identifier} → {self.event.title} ({self.status})"
