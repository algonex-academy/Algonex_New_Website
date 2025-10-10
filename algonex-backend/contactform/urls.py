from django.urls import path
from .views import ContactFormView

urlpatterns = [
    path('submit-form/', ContactFormView.as_view(), name='submit-form'),
]
