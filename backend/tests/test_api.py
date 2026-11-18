from unittest import mock

import pytest
from django.core import mail
from django.core.cache import cache
from django.core.management import call_command
from rest_framework.test import APIClient

from apps.inquiries.models import Inquiry
from apps.portfolio.models import Project, ProjectTranslation

pytestmark = pytest.mark.django_db


@pytest.fixture(autouse=True)
def _setup(settings):
    settings.EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
    settings.CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
    cache.clear()


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def seeded():
    call_command("seed_content", verbosity=0)


def valid_inquiry(**over):
    data = {
        "full_name": "Ayşe Yılmaz",
        "email": "ayse@example.com",
        "phone": "+90 555 000 00 00",
        "company": "Example Ltd",
        "requested_service": "website",
        "budget_range": "1k_3k",
        "project_description": "We need a bilingual company website with a contact form.",
        "preferred_contact_method": "email",
        "privacy_consent": True,
        "locale": "tr",
    }
    return {**data, **over}


def test_health(api):
    r = api.get("/api/v1/health/")
    assert r.status_code == 200 and r.json()["database"] == "ok"


def test_site_settings_contact(api):
    contact = api.get("/api/v1/site-settings/").json()["contact"]
    assert contact["whatsapp"] == "https://wa.me/905427130132"
    assert contact["email"] == "cnajokar11@yahoo.com"


def test_services_are_localized(api, seeded):
    en = api.get("/api/v1/services/?category=primary").json()
    fa = api.get("/api/v1/services/?category=primary", HTTP_ACCEPT_LANGUAGE="fa-IR").json()
    assert [s["slug"] for s in en] == ["website-development", "full-stack-development", "performance-marketing"]
    assert en[0]["title"] != fa[0]["title"] and fa[0]["language"] == "fa"
    assert isinstance(en[0]["features"], list) and en[0]["features"]


def test_service_detail_and_404(api, seeded):
    assert api.get("/api/v1/services/website-development/?lang=tr").json()["language"] == "tr"
    assert api.get("/api/v1/services/nope/").status_code == 404


def test_projects_list_filter_and_detail(api, seeded):
    engineering = api.get("/api/v1/projects/?kind=engineering").json()
    assert {"sinshop", "nexusticket"} <= {p["slug"] for p in engineering}
    assert "problem" not in engineering[0]  # list stays light
    detail = api.get("/api/v1/projects/nexusticket/?lang=fa").json()
    assert detail["github_url"] == "https://github.com/sinajokarr/NexusTicket"
    assert detail["language"] == "fa" and detail["features"]


def test_unpublished_projects_are_hidden(api):
    p = Project.objects.create(slug="secret", kind="client", status="concept", is_published=False)
    ProjectTranslation.objects.create(project=p, language="en", title="Secret", category="x", summary="x")
    assert api.get("/api/v1/projects/secret/").status_code == 404


def test_missing_translation_falls_back_to_english(api):
    p = Project.objects.create(slug="en-only", kind="client", status="concept")
    ProjectTranslation.objects.create(project=p, language="en", title="English", category="x", summary="x")
    assert api.get("/api/v1/projects/en-only/?lang=tr").json()["title"] == "English"


def test_inquiry_is_saved_and_owner_notified(api):
    r = api.post("/api/v1/inquiries/", valid_inquiry(), format="json")
    assert r.status_code == 201
    ref = r.json()["reference_id"]
    inquiry = Inquiry.objects.get(reference_id=ref)
    assert inquiry.status == "new" and inquiry.email_status == "sent"
    assert len(mail.outbox) == 1 and ref in mail.outbox[0].subject
    assert mail.outbox[0].to == ["cnajokar11@yahoo.com"]


def test_inquiry_response_has_no_private_fields(api):
    body = api.post("/api/v1/inquiries/", valid_inquiry(), format="json").json()
    assert set(body) == {"status", "reference_id"}


def test_private_fields_cannot_be_set(api):
    r = api.post("/api/v1/inquiries/", valid_inquiry(status="closed", internal_notes="hack"), format="json")
    inquiry = Inquiry.objects.get(reference_id=r.json()["reference_id"])
    assert inquiry.status == "new" and inquiry.internal_notes == ""


def test_email_failure_keeps_inquiry(api):
    with mock.patch("apps.inquiries.services.send_mail", side_effect=OSError("smtp down")):
        r = api.post("/api/v1/inquiries/", valid_inquiry(), format="json")
    assert r.status_code == 201
    inquiry = Inquiry.objects.get(reference_id=r.json()["reference_id"])
    assert inquiry.email_status == "failed" and "smtp down" in inquiry.email_error


@pytest.mark.parametrize("override, field", [
    ({"email": "not-an-email"}, "email"),
    ({"privacy_consent": False}, "privacy_consent"),
    ({"project_description": "short"}, "project_description"),
    ({"requested_service": "hacking"}, "requested_service"),
    ({"phone": "<script>"}, "phone"),
    ({"preferred_contact_method": "whatsapp", "phone": ""}, "phone"),
    ({"full_name": ""}, "full_name"),
])
def test_inquiry_validation(api, override, field):
    r = api.post("/api/v1/inquiries/", valid_inquiry(**override), format="json")
    assert r.status_code == 400 and field in r.json()
    assert Inquiry.objects.count() == 0


def test_honeypot_stores_nothing(api):
    r = api.post("/api/v1/inquiries/", valid_inquiry(website="http://spam.example"), format="json")
    assert r.status_code == 201 and r.json()["reference_id"] is None
    assert Inquiry.objects.count() == 0 and not mail.outbox


def test_inquiry_rate_limit(api):
    codes = [api.post("/api/v1/inquiries/", valid_inquiry(), format="json").status_code for _ in range(6)]
    assert codes[:5] == [201] * 5 and codes[5] == 429


def test_inquiries_cannot_be_listed_publicly(api):
    api.post("/api/v1/inquiries/", valid_inquiry(), format="json")
    assert api.get("/api/v1/inquiries/").status_code == 405


def test_admin_requires_staff_login(client, django_user_model):
    assert client.get("/admin/inquiries/inquiry/").status_code == 302
    user = django_user_model.objects.create_user("visitor", password="x-strong-password-1")
    client.force_login(user)
    assert client.get("/admin/inquiries/inquiry/").status_code == 302  # not staff
    admin = django_user_model.objects.create_superuser("owner", "o@example.com", "x-strong-password-1")
    client.force_login(admin)
    assert client.get("/admin/inquiries/inquiry/").status_code == 200


def test_openapi_schema(api):
    r = api.get("/api/v1/schema/")
    assert r.status_code == 200 and b"/api/v1/inquiries/" in r.content
