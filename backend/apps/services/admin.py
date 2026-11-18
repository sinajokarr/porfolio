from django.contrib import admin

from .models import Service, ServiceTranslation


class ServiceTranslationInline(admin.StackedInline):
    model = ServiceTranslation
    extra = 0
    max_num = 3


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["slug", "category", "sort_order", "is_active", "languages"]
    list_editable = ["sort_order", "is_active"]
    list_filter = ["category", "is_active"]
    search_fields = ["slug", "translations__title"]
    inlines = [ServiceTranslationInline]

    @admin.display(description="Languages")
    def languages(self, obj):
        return ", ".join(sorted(t.language for t in obj.translations.all()))

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("translations")
