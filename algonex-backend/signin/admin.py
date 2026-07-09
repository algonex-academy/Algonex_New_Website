from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import StudentRegistration, Payment


class PaymentInline(TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ["payment_date"]


@admin.register(StudentRegistration)
class StudentRegistrationAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ["student_id", "full_name", "email", "phone", "parent_phone", "course_selected", "batch_type", "total_fee", "paid_fee", "balance_fee", "registration_date", "status"]
    list_filter = ["course_selected", "batch_type", "status"]
    search_fields = ["student_id", "user__email", "user__first_name", "upi_transaction_id", "college_name"]
    readonly_fields = ["registration_date", "balance_fee"]
    inlines = [PaymentInline]
    raw_id_fields = ["user", "course"]
    
    fieldsets = (
        ("Personal Information", {
            "fields": ("user", "student_id", "parent_phone", "dob", "gender", "photo")
        }),
        ("Location Information", {
            "fields": ("street_address", "city", "state", "country", "pincode")
        }),
        ("Education Information", {
            "fields": ("college_name", "branch", "degree_level", "graduation_year", "current_year")
        }),
        ("Course / Training Information", {
            "fields": ("course_selected", "course", "batch_type", "joining_date", "why_join")
        }),
        ("Payment Details", {
            "fields": ("total_fee", "paid_fee", "balance_fee", "upi_transaction_id", "status")
        }),
        ("System Meta", {
            "fields": ("registration_date",)
        }),
    )


@admin.register(Payment)
class PaymentAdmin(ImportExportModelAdmin, ModelAdmin):
    list_display = ["student_registration", "amount", "upi_transaction_id", "status", "payment_date"]
    list_filter = ["status", "payment_date"]
    list_editable = ["status"]
    search_fields = ["student_registration__student_id", "student_registration__user__email", "upi_transaction_id"]
    raw_id_fields = ["student_registration"]
