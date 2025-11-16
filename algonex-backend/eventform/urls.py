from django.urls import path
from .views import RegisterEventView

urlpatterns = [
    path("register/", RegisterEventView.as_view(),name='register-event'),
]

