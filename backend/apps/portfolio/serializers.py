from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.core.i18n import lines, pick_translation

from .models import Project

LIST_TEXT = ["title", "category", "headline", "summary"]
DETAIL_TEXT = ["problem", "scope", "architecture", "note"]
DETAIL_LINES = ["features", "challenges", "decisions"]


class ProjectSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["slug", "kind", "status", "featured", "thumbnail", "technology_tags", "github_url", "live_url",
                  "sort_order", "published_at"]

    @extend_schema_field(serializers.URLField(allow_null=True))
    def get_thumbnail(self, obj):
        if not obj.thumbnail:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.thumbnail.url) if request else obj.thumbnail.url

    def to_representation(self, project):
        data = super().to_representation(project)
        t = pick_translation(project.translations.all(), self.context["lang"])
        data["language"] = t.language if t else None
        for f in LIST_TEXT:
            data[f] = getattr(t, f, "") if t else ""
        if self.context.get("detail"):
            for f in DETAIL_TEXT:
                data[f] = getattr(t, f, "") if t else ""
            for f in DETAIL_LINES:
                data[f] = lines(getattr(t, f, "")) if t else []
        return data
