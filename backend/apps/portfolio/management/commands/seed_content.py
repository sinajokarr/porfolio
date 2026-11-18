"""Load services and projects from content/*.json (idempotent upsert by slug).

The same JSON files are the frontend's offline fallback, so the site renders even when the API is down.
"""

import json
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.portfolio.models import Project, ProjectTranslation
from apps.services.models import Service, ServiceTranslation


def _text(value):
    return "\n".join(value) if isinstance(value, list) else (value or "")


class Command(BaseCommand):
    help = "Create or update services and projects from content/services.json and content/projects.json."

    def add_arguments(self, parser):
        parser.add_argument("--content-dir", default=str(settings.REPO_DIR / "content"))

    @transaction.atomic
    def handle(self, *args, content_dir, **options):
        root = Path(content_dir)
        services = json.loads((root / "services.json").read_text("utf-8"))
        projects = json.loads((root / "projects.json").read_text("utf-8"))

        for i, item in enumerate(services):
            service, _ = Service.objects.update_or_create(
                slug=item["slug"],
                defaults={"icon": item["icon"], "category": item["category"], "sort_order": i},
            )
            for lang, t in item["translations"].items():
                ServiceTranslation.objects.update_or_create(
                    service=service, language=lang,
                    defaults={
                        "title": t["title"], "tagline": t.get("tagline", ""), "summary": t["summary"],
                        "description": _text(t.get("description")), "features": _text(t.get("features")),
                        "benefits": _text(t.get("benefits")), "cta": t.get("cta", ""),
                    },
                )

        for i, item in enumerate(projects):
            project, _ = Project.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "kind": item["kind"], "status": item["status"], "featured": item.get("featured", False),
                    "technology_tags": item.get("technology_tags", []), "github_url": item.get("github_url", ""),
                    "live_url": item.get("live_url", ""), "sort_order": i,
                },
            )
            for lang, t in item["translations"].items():
                ProjectTranslation.objects.update_or_create(
                    project=project, language=lang,
                    defaults={k: _text(t.get(k)) for k in [
                        "title", "category", "headline", "summary", "problem", "scope", "architecture",
                        "features", "challenges", "decisions", "note",
                    ]},
                )

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(services)} services and {len(projects)} projects."))
