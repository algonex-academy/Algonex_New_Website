from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from unfold.admin import ModelAdmin
from common.admin import MediaInline
from programs.models import Program, CampusCrewRegistration



@admin.register(Program)
class ProgramAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ["name", "course_type", "is_published", "is_featured", "application_deadline"]
    list_filter = ["course_type", "is_published", "is_featured"]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [MediaInline]

    def save_model(self, request, obj, form, change):
        if not obj.course_type or obj.course_type == "course":
            obj.course_type = "fellowship"
        super().save_model(request, obj, form, change)


@admin.register(CampusCrewRegistration)
class CampusCrewRegistrationAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ["reference_id", "registration_type", "full_name", "get_institution", "status", "created_at"]
    list_filter = ["registration_type", "status", "student_primary_interest", "college_primary_interest", "created_at"]
    search_fields = ["reference_id", "full_name", "college_name", "institution_name", "email", "official_email", "phone"]
    readonly_fields = ["reference_id", "consent_timestamp", "created_at", "updated_at"]

    fieldsets = (
        ("Reference & Type", {
            "fields": ("reference_id", "registration_type", "status", "owner")
        }),
        ("Registrant Info", {
            "fields": ("full_name", "email", "phone", "city")
        }),
        ("Student Specifics", {
            "classes": ("collapse",),
            "fields": ("college_name", "department", "year_of_study", "student_primary_interest")
        }),
        ("College Specifics", {
            "classes": ("collapse",),
            "fields": ("institution_name", "designation", "official_email", "college_primary_interest", "authority_confirmed", "message")
        }),
        ("Consent & Privacy", {
            "fields": ("privacy_acknowledged", "whatsapp_opt_in", "consent_timestamp", "privacy_policy_version")
        }),
        ("Internal Notes & System", {
            "fields": ("admin_notes", "notification_sent", "notification_error", "created_at", "updated_at")
        }),
    )

    def get_institution(self, obj):
        return obj.college_name if obj.registration_type == "student" else obj.institution_name
    get_institution.short_description = "College / Institution"

