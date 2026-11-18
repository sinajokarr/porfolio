import secrets

from django.db import models

_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I confusion when read over the phone


def new_reference_id():
    return "SJ-" + "".join(secrets.choice(_ALPHABET) for _ in range(8))


class Inquiry(models.Model):
    class Service(models.TextChoices):
        WEBSITE = "website", "Website Design & Development"
        FULLSTACK = "fullstack", "Full-Stack Development"
        GOOGLE_ADS = "google_ads", "Google Ads & Performance Marketing"
        TRACKING = "tracking", "Conversion Tracking & Analytics"
        LANDING_PAGE = "landing_page", "Landing Page Development"
        OTHER = "other", "Other"

    class Budget(models.TextChoices):
        UNDER_1K = "under_1k", "Under €1,000"
        B1K_3K = "1k_3k", "€1,000 – €3,000"
        B3K_7K = "3k_7k", "€3,000 – €7,000"
        OVER_7K = "over_7k", "€7,000+"
        UNSURE = "unsure", "Not sure yet"

    class ContactMethod(models.TextChoices):
        EMAIL = "email", "Email"
        PHONE = "phone", "Phone"
        WHATSAPP = "whatsapp", "WhatsApp"

    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        QUALIFIED = "qualified", "Qualified"
        PROPOSAL_SENT = "proposal_sent", "Proposal Sent"
        CLOSED = "closed", "Closed"

    class EmailStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Handed to mail server"
        FAILED = "failed", "Failed"

    reference_id = models.CharField(max_length=12, unique=True, default=new_reference_id, editable=False)
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    company = models.CharField(max_length=120, blank=True)
    requested_service = models.CharField(max_length=20, choices=Service.choices)
    budget_range = models.CharField(max_length=20, choices=Budget.choices, blank=True)
    project_description = models.TextField(max_length=5000)
    preferred_contact_method = models.CharField(max_length=10, choices=ContactMethod.choices, default=ContactMethod.EMAIL)
    privacy_consent = models.BooleanField()
    locale = models.CharField(max_length=5, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW, db_index=True)
    internal_notes = models.TextField(blank=True)
    email_status = models.CharField(max_length=10, choices=EmailStatus.choices, default=EmailStatus.PENDING)
    email_error = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "inquiries"
        constraints = [
            models.CheckConstraint(condition=models.Q(privacy_consent=True), name="inquiry_requires_consent"),
        ]

    def __str__(self):
        return f"{self.reference_id} — {self.full_name}"
