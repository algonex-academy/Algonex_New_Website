from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from common.admin import MediaInline
from .models import Course, Tag, Enrollment, FAQ, Feedback, StudentOutcome, Certificate, EmailLog


class FAQInline(TabularInline):
    model = FAQ
    extra = 1


class FeedbackInline(TabularInline):
    model = Feedback
    extra = 1
    fk_name = "course"


@admin.register(Course)
class CourseAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("code", "name", "instructor", "level", "price", "is_published", "is_trending", "created_at")
    list_filter = ("level", "is_published", "is_trending", "skills")
    search_fields = ("code", "name", "description", "instructor__email")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("is_published", "is_trending")
    inlines = [FAQInline, FeedbackInline, MediaInline]


@admin.register(Tag)
class TagAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("category",)
    search_fields = ("name",)


@admin.register(Enrollment)
class EnrollmentAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("student", "course", "status", "enrolled_at")
    list_filter = ("status", "course")
    search_fields = ("student__email", "course__name")


@admin.register(FAQ)
class FAQAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("question", "course", "order", "is_active")
    list_filter = ("course", "is_active")
    search_fields = ("question", "answer")
    list_editable = ("order", "is_active")


@admin.register(Feedback)
class FeedbackAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("__str__", "rating", "is_approved", "created_at")
    list_filter = ("rating", "is_approved")
    search_fields = ("student__email", "name", "course__name")
    list_editable = ("is_approved",)


@admin.register(StudentOutcome)
class StudentOutcomeAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("student_name", "achievement_type", "company_name", "course", "batch_year", "is_featured", "is_published")
    list_filter = ("achievement_type", "course", "is_published", "is_featured")
    search_fields = ("student_name", "company_name", "role")
    list_editable = ("is_published", "is_featured")


@admin.register(Certificate)
class CertificateAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("certificate_id", "student_name", "certificate_type", "title", "is_verified", "issue_date", "view_certificate_link")
    list_filter = ("certificate_type", "is_verified", "issue_date")
    search_fields = ("certificate_id", "student_name", "title", "intern_id")
    list_editable = ("is_verified",)

    def view_certificate_link(self, obj):
        from django.utils.html import format_html
        from django.conf import settings
        if settings.DEBUG:
            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
            url = f"{frontend_url}/verify/Certificate/ID={obj.certificate_id}"
        else:
            url = f"/verify/Certificate/ID={obj.certificate_id}"
        return format_html(
            '<a href="{}" target="_blank" style="color: #1677ff; font-weight: bold; text-decoration: underline;">View/Download</a>',
            url
        )
    view_certificate_link.short_description = "Download/View"


@admin.register(EmailLog)
class EmailLogAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ("subject", "recipient_count", "sent_count", "failed_count", "status", "date_sent")
    list_filter = ("status", "date_sent")
    search_fields = ("subject", "body")
    readonly_fields = ("subject", "body", "recipient_count", "sent_count", "failed_count", "status", "attachments", "date_sent")
