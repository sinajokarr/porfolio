import pytest

from apps.portfolio.models import Project

pytestmark = pytest.mark.django_db


def test_health(client):
    assert client.get("/api/v1/health/").json() == {"status": "ok", "database": "ok"}


def test_services_localized(client, seeded):
    en = client.get("/api/v1/services/?category=primary").json()
    fa = client.get("/api/v1/services/?category=primary&lang=fa").json()
    assert [s["slug"] for s in en] == ["website-development", "full-stack-development", "performance-marketing"]
    assert fa[0]["language"] == "fa" and fa[0]["title"] != en[0]["title"]
    assert isinstance(en[0]["features"], list) and en[0]["features"]


def test_accept_language_header(client, seeded):
    data = client.get("/api/v1/services/website-development/", HTTP_ACCEPT_LANGUAGE="tr-TR,tr;q=0.9").json()
    assert data["language"] == "tr"


def test_projects_filter_and_detail(client, seeded):
    engineering = client.get("/api/v1/projects/?kind=engineering").json()
    assert {p["slug"] for p in engineering} >= {"sinshop", "nexusticket"}
    assert "problem" not in engineering[0]  # list stays light
    detail = client.get("/api/v1/projects/nexusticket/?lang=tr").json()
    assert detail["github_url"] == "https://github.com/sinajokarr/NexusTicket"
    assert detail["language"] == "tr" and detail["features"]


def test_unpublished_project_hidden(client, seeded):
    Project.objects.filter(slug="sinshop").update(is_published=False)
    assert client.get("/api/v1/projects/sinshop/").status_code == 404
    assert "sinshop" not in [p["slug"] for p in client.get("/api/v1/projects/").json()]


def test_content_api_is_read_only(client, seeded):
    assert client.post("/api/v1/projects/", {}).status_code == 405
    assert client.delete("/api/v1/services/website-development/").status_code == 405


def test_schema_available(client):
    response = client.get("/api/v1/schema/")
    assert response.status_code == 200 and b"/api/v1/inquiries/" in response.content


def test_russian_content(client, seeded):
    service = client.get("/api/v1/services/full-stack-development/?lang=ru").json()
    project = client.get("/api/v1/projects/sinshop/?lang=ru").json()
    assert service["language"] == "ru" and service["title"] == "Full-stack разработка"
    assert project["language"] == "ru" and project["features"]
