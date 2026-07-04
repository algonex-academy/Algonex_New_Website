from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


class Media(models.Model):
    """Generic media/image attachment for any model (courses, events, programs, etc.)."""

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    image = models.ImageField(upload_to="media/%Y/%m/")
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "created_at"]
        verbose_name_plural = "Media"
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

    def __str__(self):
        return f"Media #{self.pk} for {self.content_type} #{self.object_id}"


class SiteConfig(models.Model):
    """Consolidated site configuration singleton replacing PlatformSettings, CarouselSlide, SiteBanner, and GalleryImage."""

    # Feature toggles
    maintenance_mode = models.BooleanField(default=False, help_text="Show maintenance page to all visitors")
    maintenance_message = models.CharField(max_length=500, default="We'll be back shortly.", blank=True)

    course_enrollment_enabled = models.BooleanField(default=True, help_text="Allow students to enroll in courses")
    event_registration_enabled = models.BooleanField(default=True, help_text="Allow users to register for events")
    program_registration_enabled = models.BooleanField(default=True, help_text="Allow users to register for programs")

    # Showcase settings
    auto_publish_student_projects = models.BooleanField(default=True, help_text="Auto-publish student-submitted projects")

    # Search
    search_results_per_category = models.PositiveIntegerField(default=5, help_text="Max results per category in global search")

    # Promotional Banner Settings
    banner_text = models.CharField(max_length=500, blank=True)
    banner_link = models.URLField(blank=True, help_text="Optional link when banner is clicked")
    banner_bg_color = models.CharField(max_length=7, default="#00D4FF", help_text="Hex color, e.g. #00D4FF")
    banner_text_color = models.CharField(max_length=7, default="#000000")
    banner_is_active = models.BooleanField(default=False)

    # Carousel slides stored as a JSON list:
    # [{"slide_type": "hero", "item_slug": "", "order": 0, "is_active": true}]
    carousel_slides = models.JSONField(default=list, blank=True)

    # Gallery images stored as a JSON list:
    # [{"title": "", "image_url": "", "caption": "", "order": 0, "is_active": true, "is_featured": true}]
    gallery_images = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = "Site Configuration"
        verbose_name_plural = "Site Configurations"

    def __str__(self):
        return "Site Configuration"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Gallery(models.Model):
    title = models.CharField(max_length=255, blank=True, help_text="Optional title for the image")
    image = models.ImageField(upload_to="uploads/", help_text="Upload the image file here")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Gallery"
        verbose_name_plural = "Gallery"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title or f"Gallery Image #{self.pk} ({self.image.name})"
