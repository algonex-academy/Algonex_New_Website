from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgramViewSet, CampusCrewRegisterView, CampusCrewAdminViewSet

router = DefaultRouter()
router.register(r"campus-crew/admin", CampusCrewAdminViewSet, basename="campus-crew-admin")
router.register(r"", ProgramViewSet, basename="program")

urlpatterns = [
    path("campus-crew/register/", CampusCrewRegisterView.as_view(), name="campus-crew-register"),
    path("", include(router.urls)),
]

