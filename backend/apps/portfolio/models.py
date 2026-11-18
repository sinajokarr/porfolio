from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models


class Project(models.Model):
    class Kind(models.TextChoices):
        CLIENT = "client", "Client-facing website"
        ENGINEERING = "engineering", "Engineering project"

    class Status(models.TextChoices):
        LIVE = "live", "Live"
        DEVELOPMENT = "development", "Development Project"
        CONCEPT = "concept", "Concept"
        IN_PROGRESS = "in_progress", "In Progress"
        CASE_STUDY = "case_study", "Case Study"

    slug = models.SlugField(unique=True)
    kind = models.CharField(max_length=20, choices=Kind.choices)
    status = models.CharField(max_length=20, choices=Status.choices)
    featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    thumbnail = models.ImageField(
        upload_to="projects/",
        blank=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp", "avif"])],
        help_text="Optional. Without an image the site draws the built-in editorial diagram.",
    )
    technology_tags = models.JSONField(default=list, blank=True, help_text='e.g. ["Django", "PostgreSQL"]')
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True, help_text="Only set when the live site is verified.")
    sort_order = models.PositiveSmallIntegerField(default=0)
    published_at = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]
        indexes = [models.Index(fields=["is_published", "kind", "sort_order"])]

    def __str__(self):
        return self.slug


class ProjectTranslation(models.Model):
    project = models.ForeignKey(Project, related_name="translations", on_delete=models.CASCADE)
    language = models.CharField(max_length=5, choices=settings.LANGUAGES)
    title = models.CharField(max_length=120)
    category = models.CharField(max_length=120)
    headline = models.CharField(max_length=200, blank=True)
    summary = models.TextField()
    problem = models.TextField(blank=True)
    scope = models.TextField(blank=True)
    architecture = models.TextField(blank=True)
    features = models.TextField(blank=True, help_text="One item per line.")
    challenges = models.TextField(blank=True, help_text="One item per line.")
    decisions = models.TextField(blank=True, help_text="One item per line.")
    note = models.TextField(blank=True, help_text="Honest scope note shown on the case study, e.g. demo-only payments.")

    class Meta:
        constraints = [models.UniqueConstraint(fields=["project", "language"], name="uniq_project_language")]

    def __str__(self):
        return f"{self.project.slug} [{self.language}]"
