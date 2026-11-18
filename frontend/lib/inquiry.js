import { z } from "zod";

export const SERVICES = ["website", "fullstack", "google_ads", "tracking", "landing_page", "other"];
export const BUDGETS = ["under_1k", "1k_3k", "3k_7k", "over_7k", "unsure"];

/** Mirrors the Django serializer rules. `t` maps an error key to a localized message. */
export function inquirySchema(t) {
  return z.object({
    full_name: z.string().trim().min(2, t("nameMin")).max(120, t("tooLong")),
    email: z.string().trim().email(t("email")),
    requested_service: z.enum(SERVICES, { error: t("service") }),
    budget_range: z.union([z.enum(BUDGETS), z.literal("")]),
    project_description: z.string().trim().min(20, t("descriptionMin")).max(5000, t("tooLong")),
    privacy_consent: z.literal(true, { error: t("consent") }),
    website: z.string().optional(),
  });
}
