from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from django.utils.html import format_html
from unfold.admin import ModelAdmin
from .models import Media, SiteConfig, Gallery


class MediaInline(GenericTabularInline):
    """Reusable inline for adding media to any model's admin page."""
    model = Media
    extra = 3
    fields = ["image", "image_preview", "caption", "order"]
    readonly_fields = ["image_preview"]
    ordering = ["order"]

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:80px; border-radius:4px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"


@admin.register(Media)
class MediaAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ["image_preview", "caption", "content_type", "object_id", "order", "created_at"]
    list_filter = ["content_type"]
    readonly_fields = ["image_preview"]

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:80px; border-radius:4px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"


@admin.register(SiteConfig)
class SiteConfigAdmin(ImportExportModelAdmin, ModelAdmin):
    fieldsets = (
        ("Feature Toggles", {
            "fields": ("maintenance_mode", "maintenance_message", "course_enrollment_enabled",
                       "event_registration_enabled", "program_registration_enabled"),
        }),
        ("Showcase Settings", {
            "fields": ("auto_publish_student_projects",),
        }),
        ("Global Search Settings", {
            "fields": ("search_results_per_category",),
        }),
        ("Promotional Banner", {
            "fields": ("banner_text", "banner_link", "banner_bg_color", "banner_text_color", "banner_is_active"),
        }),
        ("Carousel & Gallery Data (JSON)", {
            "fields": ("carousel_slides", "gallery_images"),
        }),
    )

    def has_add_permission(self, request):
        return not SiteConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Gallery)
class GalleryAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ["image_preview", "title", "image", "uploaded_at"]
    list_filter = ["uploaded_at"]
    search_fields = ["title", "image"]
    readonly_fields = ["image_preview"]

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:80px; border-radius:4px;" />', obj.image.url)
        return "-"
    image_preview.short_description = "Preview"
