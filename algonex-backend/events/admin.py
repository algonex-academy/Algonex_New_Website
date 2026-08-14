from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from common.admin import MediaInline
from .models import Event, Registration


class RegistrationInline(TabularInline):
    model = Registration
    extra = 0
    readonly_fields = ("registered_at",)


@admin.register(Event)
class EventAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("title", "event_type", "start_date", "location", "speaker", "capacity", "is_published")
    list_filter = ("event_type", "is_published", "start_date")
    search_fields = ("title", "description", "speaker")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("is_published",)
    inlines = [MediaInline, RegistrationInline]

    fieldsets = (
        ("Basic Information", {
            "fields": ("title", "slug", "event_type", "is_published")
        }),
        ("Event Details & Speaker", {
            "fields": ("summary", "description", "speaker", "location", "meeting_link", "time_range")
        }),
        ("Schedule & Capacity", {
            "fields": ("start_date", "end_date", "capacity")
        }),
        ("Cover Photo & Highlights", {
            "fields": ("image", "highlights")
        }),
    )



@admin.register(Registration)
class RegistrationAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("user", "event", "status", "registered_at")
    list_filter = ("status", "event")
    search_fields = ("user__email", "event__title")
