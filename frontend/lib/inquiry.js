import { z } from "zod";

export const SERVICES = ["website", "fullstack", "google_ads", "tracking", "landing_page", "other"];
export const BUDGETS = ["under_1k", "1k_3k", "3k_7k", "over_7k", "unsure"];
export const CONTACT_METHODS = ["email", "phone", "whatsapp"];
const PHONE_RE = /^\+?[0-9][0-9\s().-]{5,24}$/;

/** Mirrors the Django serializer rules. `t` maps an error key to a localized message. */
export function inquirySchema(t) {
  return z
    .object({
      full_name: z.string().trim().min(2, t("nameMin")).max(120, t("tooLong")),
      email: z.string().trim().email(t("email")),
      phone: z.string().trim().refine((v) => !v || PHONE_RE.test(v), t("phone")),
      company: z.string().trim().max(120, t("tooLong")),
      requested_service: z.enum(SERVICES, { error: t("service") }),
      budget_range: z.union([z.enum(BUDGETS), z.literal("")]),
      project_description: z.string().trim().min(20, t("descriptionMin")).max(5000, t("tooLong")),
      preferred_contact_method: z.enum(CONTACT_METHODS, { error: t("contactMethod") }),
      privacy_consent: z.literal(true, { error: t("consent") }),
      website: z.string().optional(),
    })
    .refine((d) => d.preferred_contact_method === "email" || d.phone, { path: ["phone"], message: t("phoneRequired") });
}
