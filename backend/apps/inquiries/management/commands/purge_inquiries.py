from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.inquiries.models import Inquiry


class Command(BaseCommand):
    help = "Delete inquiries older than N days (data retention). Run from cron."

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=730)

    def handle(self, *args, days, **options):
        deleted, _ = Inquiry.objects.filter(created_at__lt=timezone.now() - timedelta(days=days)).delete()
        self.stdout.write(f"Deleted {deleted} inquiries older than {days} days.")
