from django.urls import path
from .views import SigninFormView

urlpatterns = [
    path('signin/', SigninFormView.as_view(), name='signinform'),
]
