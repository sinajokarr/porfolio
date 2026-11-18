import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/inquiry";

const schema = inquirySchema((k) => k);
const valid = {
  full_name: "Ada Lovelace", email: "ada@example.com", phone: "", company: "", requested_service: "website",
  budget_range: "", project_description: "A multilingual company website with a contact form.",
  preferred_contact_method: "email", privacy_consent: true,
};
const errorsOf = (data) => schema.safeParse(data).error?.issues.map((i) => [i.path[0], i.message]) ?? [];

describe("inquirySchema", () => {
  it("accepts a valid inquiry", () => expect(schema.safeParse(valid).success).toBe(true));
  it("requires consent", () => expect(errorsOf({ ...valid, privacy_consent: false })).toContainEqual(["privacy_consent", "consent"]));
  it("validates email", () => expect(errorsOf({ ...valid, email: "x" })).toContainEqual(["email", "email"]));
  it("requires a phone for WhatsApp", () =>
    expect(errorsOf({ ...valid, preferred_contact_method: "whatsapp" })).toContainEqual(["phone", "phoneRequired"]));
  it("rejects a short description", () =>
    expect(errorsOf({ ...valid, project_description: "short" })).toContainEqual(["project_description", "descriptionMin"]));
  it("rejects unknown services", () => expect(schema.safeParse({ ...valid, requested_service: "x" }).success).toBe(false));
});
