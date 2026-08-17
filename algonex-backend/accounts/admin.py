from import_export.admin import ImportExportModelAdmin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin, ImportExportModelAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm

    list_display = ("email", "first_name", "last_name", "role", "is_active")
    list_filter = ("role", "is_active", "date_joined")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("-date_joined",)

    fieldsets = BaseUserAdmin.fieldsets + (
        ("Profile", {"fields": ("role", "phone", "avatar", "bio")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Profile", {"fields": ("email", "first_name", "last_name", "role")}),
    )
