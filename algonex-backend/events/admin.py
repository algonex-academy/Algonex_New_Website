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
        ("Registration Form Fields Customization", {
            "fields": (
                "form_phone_mode",
                "form_college_mode",
                "form_branch_mode",
                "form_year_mode",
                "form_roll_no_mode",
                "form_student_id_mode",
                "form_github_mode",
            ),
            "description": "Select whether each field is Required (Mandatory), Optional (Non-Mandatory), or Hidden (Do Not Show) on the event registration form."
        }),
        ("Advanced Custom Questions (JSON Schema)", {
            "fields": ("registration_form_schema",),
            "description": "Optional: Add extra custom questions. Example: [{'id': 'tshirt', 'label': 'T-Shirt Size', 'type': 'select', 'options': ['S', 'M', 'L', 'XL'], 'required': True}]"
        }),
    )


@admin.register(Registration)
class RegistrationAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("get_registrant", "event", "email", "phone", "college_name", "branch", "student_id", "status", "registered_at")
    list_filter = ("status", "event")
    search_fields = ("user__email", "email", "full_name", "phone", "college_name", "branch", "roll_no", "student_id", "event__title")
    readonly_fields = ("registered_at",)
    fieldsets = (
        ("Registrant Info", {
            "fields": ("event", "user", "full_name", "email", "phone", "college_name", "branch", "year_of_study", "roll_no", "student_id", "github_url", "status", "registered_at")
        }),
        ("Custom Form Answers", {
            "fields": ("custom_answers",)
        }),
    )

    def get_registrant(self, obj):
        return obj.user.email if obj.user else (obj.full_name or obj.email or "Guest")
    get_registrant.short_description = "Registrant"
