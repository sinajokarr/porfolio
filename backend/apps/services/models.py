from django.conf import settings
from django.db import models


class Service(models.Model):
    class Category(models.TextChoices):
        PRIMARY = "primary", "Primary pillar"
        SPECIALIZED = "specialized", "Specialized service"

    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=40, help_text="Lucide icon name used by the frontend, e.g. 'code'.")
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.PRIMARY)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "sort_order", "id"]
        indexes = [models.Index(fields=["is_active", "category", "sort_order"])]

    def __str__(self):
        return self.slug


class ServiceTranslation(models.Model):
    service = models.ForeignKey(Service, related_name="translations", on_delete=models.CASCADE)
    language = models.CharField(max_length=5, choices=settings.LANGUAGES)
    title = models.CharField(max_length=120)
    tagline = models.CharField(max_length=160, blank=True)
    summary = models.TextField()
    description = models.TextField(blank=True)
    features = models.TextField(blank=True, help_text="One item per line.")
    benefits = models.TextField(blank=True, help_text="One item per line.")
    cta = models.CharField(max_length=80, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["service", "language"], name="uniq_service_language")]

    def __str__(self):
        return f"{self.service.slug} [{self.language}]"
