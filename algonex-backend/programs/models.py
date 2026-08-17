from django.db import models
from courses.models import Course



class ProgramManager(Course._default_manager.__class__):
    """Default manager for Program proxy – auto-filters to fellowship/internship."""

    def get_queryset(self):
        return super().get_queryset().filter(course_type__in=["fellowship", "internship"])


class Program(Course):
    """Proxy model that provides a Programs-specific view of the Course table."""

    objects = ProgramManager()

    class Meta:
        proxy = True
        ordering = ["-is_featured", "-created_at"]
        verbose_name = "Program"
        verbose_name_plural = "Programs"

    # ── Convenience aliases so callers can use program.title / program.program_type ──
    @property
    def title(self):
        return self.name

    @title.setter
    def title(self, value):
        self.name = value

    @property
    def program_type(self):
        return self.course_type

    @program_type.setter
    def program_type(self, value):
        self.course_type = value

    def __str__(self):
        return f"{self.name} ({self.get_course_type_display()})"

    def save(self, *args, **kwargs):
        # Ensure new programs get a zero price if not explicitly provided
        if self.price is None:
            self.price = 0
        # Auto-assign a default instructor if none provided (required FK on Course)
        if self.instructor_id is None:
            from django.contrib.auth import get_user_model
            from django.utils.crypto import get_random_string
            User = get_user_model()
            instructor = (
                User.objects.filter(role='instructor').first()
                or User.objects.filter(is_superuser=True).first()
                or User.objects.first()
            )
            if instructor is None:
                # Create a system user as last resort
                instructor = User.objects.create_user(
                    email="system@algonex.in",
                    password=get_random_string(12),
                    first_name="System",
                    last_name="Admin",
                    role="admin",
                )
            self.instructor = instructor
        super().save(*args, **kwargs)


class CampusCrewRegistration(models.Model):
    """
    Campus Crew Registration model for both Student registrations and College inquiries.
    Stores opaque reference ID (e.g. ACC-S-XXXXXX, ACC-C-XXXXXX), details, consent state, and operational tracking.
    """
    REGISTRATION_TYPE_CHOICES = [
        ("student", "Student"),
        ("college", "College Inquiry"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("reviewed", "Reviewed"),
        ("contacted", "Contacted"),
        ("archived", "Archived"),
    ]

    STUDENT_INTEREST_CHOICES = [
        ("AI", "AI & Machine Learning"),
        ("Web/App Development", "Web/App Development"),
        ("Data", "Data Science & Analytics"),
        ("Cybersecurity", "Cybersecurity"),
        ("Cloud/DevOps", "Cloud & DevOps"),
        ("Entrepreneurship/Innovation", "Entrepreneurship & Innovation"),
        ("Other", "Other"),
    ]

    COLLEGE_INTEREST_CHOICES = [
        ("Campus Crew chapter", "Campus Crew chapter"),
        ("Workshop or expert session", "Workshop or expert session"),
        ("Student project program", "Student project program"),
        ("Hackathon or innovation activity", "Hackathon or innovation activity"),
        ("Discuss options", "Discuss options"),
    ]

    reference_id = models.CharField(max_length=32, unique=True, db_index=True)
    registration_type = models.CharField(max_length=20, choices=REGISTRATION_TYPE_CHOICES, db_index=True)

    # Registrant info (shared)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, db_index=True)
    phone = models.CharField(max_length=30, db_index=True)
    city = models.CharField(max_length=100, blank=True)

    # Student specific
    college_name = models.CharField(max_length=200, blank=True)
    department = models.CharField(max_length=150, blank=True)
    year_of_study = models.CharField(max_length=50, blank=True)
    student_primary_interest = models.CharField(max_length=100, blank=True, choices=STUDENT_INTEREST_CHOICES)

    # College specific
    institution_name = models.CharField(max_length=200, blank=True)
    designation = models.CharField(max_length=150, blank=True)
    official_email = models.EmailField(max_length=150, blank=True)
    college_primary_interest = models.CharField(max_length=100, blank=True, choices=COLLEGE_INTEREST_CHOICES)
    authority_confirmed = models.BooleanField(default=False)
    message = models.TextField(blank=True, max_length=1000)

    # Consent & Opt-in
    privacy_acknowledged = models.BooleanField(default=True)
    whatsapp_opt_in = models.BooleanField(default=False)
    consent_timestamp = models.DateTimeField(auto_now_add=True)
    privacy_policy_version = models.CharField(max_length=20, default="2026.04")

    # Management / Administrative
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)
    owner = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="campus_crew_leads"
    )
    admin_notes = models.TextField(blank=True)
    notification_sent = models.BooleanField(default=False)
    notification_error = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Campus Crew Registration"
        verbose_name_plural = "Campus Crew Registrations"

    def __str__(self):
        target = self.college_name if self.registration_type == "student" else self.institution_name
        return f"{self.reference_id} | {self.get_registration_type_display()} | {self.full_name} ({target})"

    def save(self, *args, **kwargs):
        # reference_id is readonly in the admin form, so admin-created rows
        # arrive here without one; unique="" would collide from the 2nd add.
        if not self.reference_id:
            import secrets
            prefix = "ACC-S" if self.registration_type == "student" else "ACC-C"
            ref_id = f"{prefix}-{secrets.token_hex(4).upper()}"
            while CampusCrewRegistration.objects.filter(reference_id=ref_id).exists():
                ref_id = f"{prefix}-{secrets.token_hex(4).upper()}"
            self.reference_id = ref_id
        super().save(*args, **kwargs)

