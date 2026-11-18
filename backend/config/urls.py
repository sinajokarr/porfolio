from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework.routers import SimpleRouter

from apps.core.views import HealthView, SiteSettingsView
from apps.inquiries.views import InquiryCreateView
from apps.portfolio.views import ProjectViewSet
from apps.services.views import ServiceViewSet

router = SimpleRouter()
router.register("services", ServiceViewSet, basename="service")
router.register("projects", ProjectViewSet, basename="project")

api_v1 = [
    path("health/", HealthView.as_view(), name="health"),
    path("site-settings/", SiteSettingsView.as_view(), name="site-settings"),
    path("inquiries/", InquiryCreateView.as_view(), name="inquiry-create"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    *router.urls,
]

admin.site.site_header = "Sina Jokar — Website Admin"
admin.site.site_title = "Sina Jokar Admin"

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/v1/", include(api_v1)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
