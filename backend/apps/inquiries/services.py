import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import Inquiry

log = logging.getLogger(__name__)


def create_inquiry(data):
    """Persist first, notify second: a failed email never loses the lead."""
    inquiry = Inquiry.objects.create(**data)  # preferred_contact_method defaults to email when the form omits it
    notify_owner(inquiry)
    return inquiry


def notify_owner(inquiry):
    # ponytail: sent inline with a 10s SMTP timeout; move to a task queue if mail latency becomes a problem.
    body = "\n".join([
        f"Reference: {inquiry.reference_id}",
        f"Received: {timezone.localtime(inquiry.created_at):%Y-%m-%d %H:%M %Z}",
        f"Name: {inquiry.full_name}",
        f"Email: {inquiry.email}",
        f"Phone: {inquiry.phone or '—'}",
        f"Company: {inquiry.company or '—'}",
        f"Service: {inquiry.get_requested_service_display()}",
        f"Budget: {inquiry.get_budget_range_display() or '—'}",
        f"Preferred contact: {inquiry.get_preferred_contact_method_display()}",
        f"Site language: {inquiry.locale or '—'}",
        "",
        inquiry.project_description,
    ])
    try:
        send_mail(
            subject=f"New project inquiry {inquiry.reference_id} — {inquiry.get_requested_service_display()}",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.INQUIRY_NOTIFY_EMAIL],
        )
        inquiry.email_status, inquiry.email_error = Inquiry.EmailStatus.SENT, ""
    except Exception as exc:  # any SMTP/network failure: keep the inquiry, record the reason
        log.exception("Inquiry %s notification failed", inquiry.reference_id)
        inquiry.email_status, inquiry.email_error = Inquiry.EmailStatus.FAILED, str(exc)[:255]
    inquiry.save(update_fields=["email_status", "email_error", "updated_at"])
