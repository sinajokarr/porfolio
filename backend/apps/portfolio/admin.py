from django.contrib import admin

from .models import Project, ProjectTranslation


class ProjectTranslationInline(admin.StackedInline):
    model = ProjectTranslation
    extra = 0
    max_num = 3


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["slug", "kind", "status", "featured", "is_published", "sort_order"]
    list_editable = ["status", "featured", "is_published", "sort_order"]
    list_filter = ["kind", "status", "featured", "is_published"]
    search_fields = ["slug", "translations__title", "github_url"]
    inlines = [ProjectTranslationInline]
    fieldsets = [
        (None, {"fields": ["slug", "kind", "status", "featured", "is_published", "sort_order", "published_at"]}),
        ("Links & media", {"fields": ["github_url", "live_url", "thumbnail", "technology_tags"]}),
    ]
