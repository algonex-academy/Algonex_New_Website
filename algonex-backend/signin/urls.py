from django.urls import path
from .views import SigninFormView, RegisterStep1View, RegisterStep2View, StudentRegisterView, NextStudentIdView, VerifyCrueIdView

urlpatterns = [
    path("", StudentRegisterView.as_view(), name="student-register"),
    path("signin/", SigninFormView.as_view(), name="signin-form"),
    path("step1/", RegisterStep1View.as_view(), name="register-step1"),
    path("step2/", RegisterStep2View.as_view(), name="register-step2"),
    path("next-id/", NextStudentIdView.as_view(), name="next-student-id"),
    path("verify-crue-id/", VerifyCrueIdView.as_view(), name="verify-crue-id"),
    path("verify-student-id/", VerifyCrueIdView.as_view(), name="verify-student-id"),
]
