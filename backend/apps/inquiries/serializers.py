import re

from rest_framework import serializers

from .models import Inquiry

PHONE_RE = re.compile(r"^\+?[0-9][0-9\s().-]{5,24}$")


class InquiryCreateSerializer(serializers.ModelSerializer):
    """Write-only public serializer. Internal fields (status, notes, email_*) are never accepted or returned."""

    website = serializers.CharField(required=False, allow_blank=True, write_only=True)  # honeypot
    full_name = serializers.CharField(min_length=2, max_length=120)
    project_description = serializers.CharField(min_length=20, max_length=5000)

    class Meta:
        model = Inquiry
        fields = ["full_name", "email", "phone", "company", "requested_service", "budget_range",
                  "project_description", "preferred_contact_method", "privacy_consent", "locale", "website"]
        extra_kwargs = {"locale": {"required": False}, "preferred_contact_method": {"required": False}}

    def validate_phone(self, value):
        value = value.strip()
        if value and not PHONE_RE.match(value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value

    def validate_privacy_consent(self, value):
        if value is not True:
            raise serializers.ValidationError("Consent is required.")
        return value

    def validate_locale(self, value):
        return value if value in {"en", "tr", "fa", "ru"} else ""

    def validate(self, attrs):
        method = attrs.get("preferred_contact_method")
        if method in {"phone", "whatsapp"} and not attrs.get("phone"):
            raise serializers.ValidationError({"phone": "A phone number is required for this contact method."})
        return attrs
