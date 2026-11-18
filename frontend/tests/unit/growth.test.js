import { describe, expect, it } from "vitest";
import { costPerLead, simulateFunnel } from "@/lib/growth";

describe("simulateFunnel", () => {
  it("computes each funnel stage", () => {
    const r = simulateFunnel({ budget: 1000, cpc: 2, ctr: 5, conversionRate: 4, closeRate: 25 });
    expect(r.clicks).toBe(500);
    expect(r.impressions).toBe(10000);
    expect(r.leads).toBe(20);
    expect(r.customers).toBe(5);
    expect(r.costPerLead).toBe(50);
    expect(r.acquisitionCost).toBe(200);
  });

  it("never divides by zero", () => {
    const r = simulateFunnel({ budget: 1000, cpc: 0, ctr: 0, conversionRate: 0, closeRate: 0 });
    expect(r.clicks).toBe(0);
    expect(r.costPerLead).toBeNull();
    expect(r.acquisitionCost).toBeNull();
  });

  it("cost per lead equals CPC / conversion rate", () => {
    expect(costPerLead(1.2, 4)).toBeCloseTo(30);
    expect(costPerLead(1.2, 0)).toBeNull();
  });
});
