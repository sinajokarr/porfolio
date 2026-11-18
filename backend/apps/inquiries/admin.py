from django.contrib import admin

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ["reference_id", "full_name", "requested_service", "status", "preferred_contact_method",
                    "email_status", "created_at"]
    list_editable = ["status"]
    list_filter = ["status", "requested_service", "preferred_contact_method", "email_status", "created_at"]
    search_fields = ["reference_id", "full_name", "email", "phone", "company", "project_description"]
    date_hierarchy = "created_at"
    readonly_fields = ["reference_id", "full_name", "email", "phone", "company", "requested_service", "budget_range",
                       "project_description", "preferred_contact_method", "privacy_consent", "locale",
                       "email_status", "email_error", "created_at", "updated_at"]
    fieldsets = [
        ("Lead", {"fields": ["status", "internal_notes"]}),
        ("Submitted", {"fields": ["reference_id", "created_at", "full_name", "email", "phone", "company",
                                  "requested_service", "budget_range", "preferred_contact_method",
                                  "project_description", "privacy_consent", "locale"]}),
        ("Notification", {"fields": ["email_status", "email_error", "updated_at"]}),
    ]
    actions = ["mark_contacted"]

    def has_add_permission(self, request):
        return False  # inquiries only come from the website form

    @admin.action(description="Mark selected as contacted")
    def mark_contacted(self, request, queryset):
        queryset.update(status=Inquiry.Status.CONTACTED)
