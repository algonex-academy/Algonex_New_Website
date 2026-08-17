from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from common.views import (
    ActiveBannerView, SearchView, AdminStatsView, CarouselView,
    PlatformSettingsView, GeneralFAQListView, GalleryImageListView,
    send_enrollment_email_view, admin_communication_view
)
from common.backup_views import (
    AdminBackupListView, AdminBackupCreateView, AdminBackupRestoreView
)
from signin.views import PaymentSummaryView, SubmitPaymentView


urlpatterns = [
    path("admin/courses/communication/", admin_communication_view, name="admin_courses_communication"),
    path("admin/send-enrollment-email/", send_enrollment_email_view, name="admin_send_enrollment_email"),
    path("admin/", admin.site.urls),
    # API v1
    path("api/v1/auth/", include("accounts.urls")),
    path("api/v1/", include("courses.urls")),
    path("api/v1/", include("events.urls")),
    path("api/v1/", include("careers.urls")),
    path("api/v1/", include("portfolio.urls")),
    path("api/v1/", include("showcase.urls")),
    path("api/v1/programs/", include("programs.urls")),
    path("api/v1/contact/", include("contactform.urls")),
    path("api/v1/register/", include("signin.urls")),
    path("api/v1/payments/summary/", PaymentSummaryView.as_view(), name="payment-summary"),
    path("api/v1/payments/pay/", SubmitPaymentView.as_view(), name="payment-pay"),
    path("api/v1/signin/submit-payment/", SubmitPaymentView.as_view(), name="payment-submit-alt"),
    path("api/v1/carousel/", CarouselView.as_view(), name="carousel"),
    path("api/v1/settings/", PlatformSettingsView.as_view(), name="platform-settings"),
    path("api/v1/banner/", ActiveBannerView.as_view(), name="active-banner"),
    path("api/v1/search/", SearchView.as_view(), name="global-search"),
    path("api/v1/admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("api/v1/admin/backups/", AdminBackupListView.as_view(), name="admin-backups-list"),
    path("api/v1/admin/backups/create/", AdminBackupCreateView.as_view(), name="admin-backups-create"),
    path("api/v1/admin/backups/restore/", AdminBackupRestoreView.as_view(), name="admin-backups-restore"),
    path("api/v1/faqs/", GeneralFAQListView.as_view(), name="faqs"),
    path("api/v1/gallery/", GalleryImageListView.as_view(), name="gallery"),
    path("api/v1/buddy/", include("buddy.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
