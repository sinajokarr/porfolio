from rest_framework import viewsets

from apps.core.i18n import request_language

from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ServiceSerializer
    lookup_field = "slug"
    filterset_fields = ["category"]
    pagination_class = None  # ponytail: under 20 services, pagination adds nothing

    def get_queryset(self):
        return Service.objects.filter(is_active=True).prefetch_related("translations")

    def get_serializer_context(self):
        return {**super().get_serializer_context(), "lang": request_language(self.request)}
