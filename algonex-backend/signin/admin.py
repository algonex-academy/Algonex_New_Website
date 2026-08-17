from django.contrib import admin
from django.contrib.auth import get_user_model
from import_export import resources, fields
from import_export.admin import ImportExportModelAdmin
from import_export.widgets import ForeignKeyWidget
from unfold.admin import ModelAdmin, TabularInline
from .models import StudentRegistration, Payment

User = get_user_model()


class StudentRegistrationResource(resources.ModelResource):
    user = fields.Field(
        column_name="user",
        attribute="user",
        widget=ForeignKeyWidget(User, "id")
    )

    class Meta:
        model = StudentRegistration
        import_id_fields = ["id"]
        skip_unchanged = True
        report_skipped = True
        fields = (
            "id", "user", "student_id", "parent_phone", "dob", "gender",
            "street_address", "city", "state", "country", "pincode",
            "college_name", "branch", "degree_level", "graduation_year",
            "current_year", "employment_status", "years_of_experience",
            "course_selected", "terms_agreed", "batch_type", "joining_date",
            "photo", "registration_date", "status", "total_fee", "paid_fee",
            "balance_fee", "upi_transaction_id", "why_join"
        )

    def before_import_row(self, row, **kwargs):
        user_val = str(row.get("user", "")).strip()
        student_id = str(row.get("student_id", "")).strip()
        
        user_obj = None
        if user_val.isdigit():
            user_obj = User.objects.filter(id=int(user_val)).first()
        elif "@" in user_val:
            user_obj = User.objects.filter(email=user_val).first()

        if not user_obj and student_id:
            email = f"student_{student_id.lower()}@algonex.in"
            user_obj, _ = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": f"student_{student_id.lower()}",
                    "first_name": row.get("why_join", "")[:30] or f"Student {student_id}",
                    "role": "student",
                    "phone": row.get("parent_phone", ""),
                }
            )

        if user_obj:
            row["user"] = user_obj.id


class PaymentResource(resources.ModelResource):
    student_registration = fields.Field(
        column_name="student_registration",
        attribute="student_registration",
        widget=ForeignKeyWidget(StudentRegistration, "id")
    )

    class Meta:
        model = Payment
        import_id_fields = ["id"]
        skip_unchanged = True
        report_skipped = True
        fields = (
            "id", "student_registration", "amount", "upi_transaction_id",
            "status", "remarks", "payment_date", "created_at", "updated_at"
        )

    def before_import_row(self, row, **kwargs):
        reg_val = str(row.get("student_registration", "")).strip()
        if reg_val.isdigit():
            reg_obj = StudentRegistration.objects.filter(id=int(reg_val)).first()
            if reg_obj:
                row["student_registration"] = reg_obj.id


class PaymentInline(TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ["payment_date"]


@admin.register(StudentRegistration)
class StudentRegistrationAdmin(ImportExportModelAdmin, ModelAdmin):
    resource_classes = [StudentRegistrationResource]
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
    resource_classes = [PaymentResource]
    list_display = ["student_registration", "amount", "upi_transaction_id", "status", "payment_date"]
    list_filter = ["status", "payment_date"]
    list_editable = ["status"]
    search_fields = ["student_registration__student_id", "student_registration__user__email", "upi_transaction_id"]
    raw_id_fields = ["student_registration"]
