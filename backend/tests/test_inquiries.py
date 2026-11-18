from unittest import mock

import pytest
from django.core import mail

from apps.inquiries.models import Inquiry

pytestmark = pytest.mark.django_db
URL = "/api/v1/inquiries/"


def payload(**overrides):
    data = {
        "full_name": "Ada Lovelace",
        "email": "ada@example.com",
        "phone": "+90 555 000 00 00",
        "company": "Analytical Ltd",
        "requested_service": "website",
        "budget_range": "1k_3k",
        "project_description": "We need a multilingual company website with a contact form.",
        "preferred_contact_method": "email",
        "privacy_consent": True,
        "locale": "tr",
    }
    return {**data, **overrides}


def test_valid_inquiry_is_stored_and_notified(client):
    response = client.post(URL, payload(), content_type="application/json")
    assert response.status_code == 201
    body = response.json()
    assert set(body) == {"status", "reference_id"}  # no internal fields leak back
    inquiry = Inquiry.objects.get(reference_id=body["reference_id"])
    assert inquiry.status == "new" and inquiry.email_status == "sent" and inquiry.locale == "tr"
    assert len(mail.outbox) == 1
    message = mail.outbox[0]
    assert message.to == ["cnajokar11@yahoo.com"]
    assert body["reference_id"] in message.subject and "ada@example.com" in message.body


@pytest.mark.parametrize("field,value", [
    ("email", "not-an-email"),
    ("full_name", "A"),
    ("project_description", "too short"),
    ("requested_service", "hacking"),
    ("privacy_consent", False),
    ("phone", "<script>"),
])
def test_invalid_fields_rejected(client, field, value):
    response = client.post(URL, payload(**{field: value}), content_type="application/json")
    assert response.status_code == 400 and field in response.json()
    assert Inquiry.objects.count() == 0


def test_whatsapp_requires_phone(client):
    response = client.post(URL, payload(phone="", preferred_contact_method="whatsapp"), content_type="application/json")
    assert response.status_code == 400 and "phone" in response.json()


def test_internal_fields_cannot_be_set(client):
    client.post(URL, payload(status="closed", internal_notes="x", email_status="sent"), content_type="application/json")
    inquiry = Inquiry.objects.get()
    assert inquiry.status == "new" and inquiry.internal_notes == ""


def test_honeypot_stores_nothing(client):
    response = client.post(URL, payload(website="http://spam.example"), content_type="application/json")
    assert response.status_code == 201 and Inquiry.objects.count() == 0 and not mail.outbox


def test_email_failure_keeps_inquiry(client):
    with mock.patch("apps.inquiries.services.send_mail", side_effect=OSError("SMTP down")):
        response = client.post(URL, payload(), content_type="application/json")
    assert response.status_code == 201
    inquiry = Inquiry.objects.get()
    assert inquiry.email_status == "failed" and "SMTP down" in inquiry.email_error


def test_inquiries_not_publicly_readable(client):
    client.post(URL, payload(), content_type="application/json")
    assert client.get(URL).status_code == 405


def test_rate_limited(client):
    codes = [client.post(URL, payload(), content_type="application/json").status_code for _ in range(6)]
    assert codes[:5] == [201] * 5 and codes[5] == 429


def test_admin_requires_staff(client, django_user_model):
    assert client.get("/admin/inquiries/inquiry/").status_code == 302  # redirect to login
    user = django_user_model.objects.create_user("visitor", password="a-long-password-123")
    client.force_login(user)
    assert client.get("/admin/inquiries/inquiry/").status_code == 302
    admin = django_user_model.objects.create_superuser("owner", password="a-long-password-123")
    client.force_login(admin)
    assert client.get("/admin/inquiries/inquiry/").status_code == 200
