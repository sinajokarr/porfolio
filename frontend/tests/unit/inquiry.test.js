import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/lib/inquiry";

const schema = inquirySchema((k) => k);
const valid = {
  full_name: "Ada Lovelace", email: "ada@example.com", requested_service: "website", budget_range: "",
  project_description: "A multilingual company website with a contact form.", privacy_consent: true,
};
const errorsOf = (data) => schema.safeParse(data).error?.issues.map((i) => [i.path[0], i.message]) ?? [];

describe("inquirySchema", () => {
  it("accepts a valid inquiry with no budget", () => expect(schema.safeParse(valid).success).toBe(true));
  it("accepts a budget range", () => expect(schema.safeParse({ ...valid, budget_range: "1k_3k" }).success).toBe(true));
  it("requires consent", () => expect(errorsOf({ ...valid, privacy_consent: false })).toContainEqual(["privacy_consent", "consent"]));
  it("validates email", () => expect(errorsOf({ ...valid, email: "x" })).toContainEqual(["email", "email"]));
  it("rejects a short description", () =>
    expect(errorsOf({ ...valid, project_description: "short" })).toContainEqual(["project_description", "descriptionMin"]));
  it("rejects unknown services", () => expect(schema.safeParse({ ...valid, requested_service: "x" }).success).toBe(false));
});
