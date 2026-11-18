from rest_framework import serializers

from apps.core.i18n import lines, pick_translation


class ServiceSerializer(serializers.Serializer):
    slug = serializers.SlugField()
    icon = serializers.CharField()
    category = serializers.CharField()
    sort_order = serializers.IntegerField()

    def to_representation(self, service):
        data = super().to_representation(service)
        t = pick_translation(service.translations.all(), self.context["lang"])
        data.update(
            language=t.language if t else None,
            title=t.title if t else service.slug,
            tagline=t.tagline if t else "",
            summary=t.summary if t else "",
            description=t.description if t else "",
            features=lines(t.features) if t else [],
            benefits=lines(t.benefits) if t else [],
            cta=t.cta if t else "",
        )
        return data
