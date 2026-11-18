from rest_framework import viewsets

from apps.core.i18n import request_language

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProjectSerializer
    lookup_field = "slug"
    filterset_fields = ["kind", "status", "featured"]
    pagination_class = None  # ponytail: a portfolio has a handful of projects

    def get_queryset(self):
        return Project.objects.filter(is_published=True).prefetch_related("translations")

    def get_serializer_context(self):
        return {
            **super().get_serializer_context(),
            "lang": request_language(self.request),
            "detail": self.action == "retrieve",
        }
