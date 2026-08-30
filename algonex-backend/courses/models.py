from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from common.mixins import TimestampMixin, SlugMixin


class Tag(models.Model):
    """Unified tag/skill/technology label used across the platform."""

    CATEGORY_CHOICES = [
        ("skill", "Skill"),
        ("tech", "Technology"),
        ("tool", "Tool"),
        ("general", "General"),
    ]

    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="skill", db_index=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Course(TimestampMixin, SlugMixin, models.Model):
    """A course offered on the platform."""

    LEVEL_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="courses_taught",
    )
    name = models.CharField(max_length=255)
    code = models.CharField(
        max_length=10,
        blank=True,
        help_text="2-character course code for Student IDs (e.g., PY for Python, DS for Data Science, ME for MERN)"
    )
    description = models.TextField()
    image = models.ImageField(upload_to="courses/images/", blank=True, null=True)
    banner = models.ImageField(upload_to="courses/banners/", blank=True, null=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="beginner", db_index=True)
    prior_knowledge = models.TextField(blank=True)
    duration = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Discount percentage (0-100)",
    )
    is_trending = models.BooleanField(default=False, db_index=True)
    is_published = models.BooleanField(default=False, db_index=True)
    skills = models.ManyToManyField(Tag, blank=True, related_name="courses")
    media = GenericRelation("common.Media")

    # Program specific fields merged into Course
    COURSE_TYPE_CHOICES = [
        ("course", "Course"),
        ("fellowship", "Fellowship"),
        ("internship", "Internship"),
    ]
    DEGREE_CHOICES = [
        ("diploma", "Diploma"),
        ("bachelors", "Bachelors"),
        ("masters", "Masters"),
        ("phd", "PhD"),
        ("other", "Other"),
    ]

    course_type = models.CharField(max_length=20, choices=COURSE_TYPE_CHOICES, default="course", db_index=True)
    curriculum = models.JSONField(default=list, blank=True)
    stipend = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=255, blank=True)
    is_remote = models.BooleanField(default=False)
    eligibility_criteria = models.TextField(blank=True)
    min_degree_level = models.CharField(max_length=20, choices=DEGREE_CHOICES, blank=True)
    eligible_branches = models.TextField(blank=True)
    application_deadline = models.DateField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    is_featured = models.BooleanField(default=False, db_index=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def is_accepting(self):
        from django.utils import timezone
        if self.application_deadline:
            return self.application_deadline >= timezone.now().date()
        return True

    @property
    def registration_count(self):
        return self.__dict__.get("_registration_count", self.student_registrations.count())

    @registration_count.setter
    def registration_count(self, value):
        self.__dict__["_registration_count"] = value

    @property
    def spots_left(self):
        if self.capacity is not None:
            return max(0, self.capacity - self.registration_count)
        return 0

    def generate_code(self):
        if not self.name:
            return "PY"
        n_lower = self.name.lower()
        if "python" in n_lower or "py" in n_lower:
            return "PY"
        elif "data" in n_lower or "science" in n_lower or "analyst" in n_lower:
            return "DS"
        elif "mern" in n_lower or "react" in n_lower:
            return "ME"
        elif "java" in n_lower:
            return "JV"
        elif "cyber" in n_lower or "security" in n_lower:
            return "CS"
        elif "ai" in n_lower or "machine" in n_lower:
            return "AI"

        words = self.name.split()
        if len(words) >= 2:
            w1 = "".join(c for c in words[0] if c.isalnum())
            w2 = "".join(c for c in words[1] if c.isalnum())
            if w1 and w2:
                return (w1[0] + w2[0]).upper()

        clean = "".join(c for c in self.name if c.isalnum()).upper()
        return clean[:2] if len(clean) >= 2 else (clean + "P")[:2]

    def save(self, *args, **kwargs):
        if not self.code and self.name:
            self.code = self.generate_code()
        elif self.code:
            self.code = self.code.upper().strip()
        super().save(*args, **kwargs)


class Enrollment(models.Model):
    """Tracks a student's enrollment in a course."""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("dropped", "Dropped"),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    class Meta:
        unique_together = ("student", "course")
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.student.email} → {self.course.name}"


class FAQ(TimestampMixin, models.Model):
    """Unified FAQ model replacing GeneralFAQ and CourseFAQ."""

    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="faqs",
        null=True, blank=True
    )
    question = models.CharField(max_length=500)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "created_at"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        course_prefix = f"[{self.course.name}] " if self.course else "[General] "
        return f"{course_prefix}{self.question[:50]}"


class Feedback(TimestampMixin, models.Model):
    """Unified feedback model combining CourseReview and Testimonial."""

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="feedbacks",
        null=True, blank=True
    )
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="feedbacks",
        null=True, blank=True
    )
    name = models.CharField(max_length=150, blank=True)
    role = models.CharField(max_length=150, blank=True)
    image = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5
    )
    text = models.TextField()
    is_approved = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "course"],
                name="unique_student_course_feedback",
                condition=models.Q(student__isnull=False, course__isnull=False)
            )
        ]

    def __str__(self):
        author = self.student.email if self.student else self.name
        course_name = self.course.name if self.course else "General"
        return f"{author} → {course_name} ({self.rating}★)"


class StudentOutcome(TimestampMixin, models.Model):
    """Unified student placements & alumni wall profile."""

    class AchievementType(models.TextChoices):
        PLACED = "placed", "Placed"
        PROMOTED = "promoted", "Promoted"
        FREELANCING = "freelancing", "Freelancing"
        PROJECT_LAUNCHED = "project_launched", "Project Launched"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="outcomes"
    )
    student_name = models.CharField(max_length=150)
    avatar = models.ImageField(upload_to="alumni/avatars/", blank=True, null=True)
    achievement_type = models.CharField(
        max_length=30, choices=AchievementType.choices, default="placed"
    )
    company_name = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=100, blank=True)
    package_range = models.CharField(max_length=50, blank=True)
    course = models.ForeignKey(
        "courses.Course", on_delete=models.CASCADE, related_name="outcomes"
    )
    achieved_at = models.DateField(null=True, blank=True)
    batch_year = models.PositiveIntegerField(null=True, blank=True)
    linkedin_url = models.URLField(blank=True)
    short_quote = models.CharField(max_length=300, blank=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["-batch_year", "-achieved_at", "student_name"]

    def __str__(self):
        achievement = self.get_achievement_type_display() if self.achievement_type else "Achievement"
        at_company = f" at {self.company_name}" if self.company_name else ""
        return f"{self.student_name} - {achievement}{at_company}"


class Certificate(TimestampMixin, models.Model):
    """Certificate issued to a student for course/internship completion."""

    certificate_id = models.CharField(max_length=50, unique=True, primary_key=True)
    intern_id = models.CharField(max_length=50, blank=True, null=True)
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="certificates"
    )
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="certificates"
    )
    student_name = models.CharField(max_length=150)  # Keep for backward compatibility/fallback
    certificate_type = models.CharField(max_length=100, default="Certification Of Internship")
    title = models.CharField(max_length=200, help_text="e.g. SQL AI SPARK Team Fellow")
    description = models.TextField()
    worked_tools_text = models.CharField(
        max_length=255,
        blank=True,
        help_text="Comma-separated tools, e.g., Google Ads, Google Analytics",
    )
    worked_tools = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="certificates"
    )
    badge_text = models.CharField(max_length=100, default="EXCELLENCE of SPARK")
    is_verified = models.BooleanField(default=True)
    issue_date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-issue_date"]

    def __str__(self):
        return f"{self.student_name} — {self.certificate_id}"


class EmailLog(models.Model):
    """Tracks history of dispatched admin communications."""

    subject = models.CharField(max_length=255)
    body = models.TextField()
    recipient_count = models.PositiveIntegerField(default=0)
    sent_count = models.PositiveIntegerField(default=0)
    failed_count = models.PositiveIntegerField(default=0)
    date_sent = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Delivered")  # Delivered, Partial, Failed
    attachments = models.JSONField(default=list, blank=True)  # List of filenames sent

    class Meta:
        ordering = ["-date_sent"]

    def __str__(self):
        return f"{self.subject} ({self.recipient_count} recipients) — {self.date_sent.strftime('%Y-%m-%d')}"

