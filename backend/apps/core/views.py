from django.conf import settings
from django.db import connection
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthView(APIView):
    throttle_classes = []

    @extend_schema(responses={200: dict, 503: dict})
    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            return Response({"status": "ok", "database": "ok"})
        except Exception:
            return Response({"status": "degraded", "database": "unavailable"}, status=503)


class SiteSettingsView(APIView):
    @extend_schema(responses={200: dict})
    def get(self, request):
        return Response({"contact": settings.SITE_CONTACT, "languages": [c for c, _ in settings.LANGUAGES]})
