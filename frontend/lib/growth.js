/**
 * Illustrative paid-search funnel. Pure function so it can be unit-tested.
 * Rates are percentages (e.g. 4 = 4%). `ctr` is optional: without it, impressions are not estimated.
 */
export function simulateFunnel({ budget, cpc, ctr = 0, conversionRate, closeRate }) {
  const clicks = cpc > 0 ? budget / cpc : 0;
  const impressions = ctr > 0 ? clicks / (ctr / 100) : 0;
  const leads = clicks * (conversionRate / 100);
  const customers = leads * (closeRate / 100);
  return {
    impressions: Math.round(impressions),
    clicks: Math.round(clicks),
    leads: Math.round(leads * 10) / 10,
    customers: Math.round(customers * 10) / 10,
    costPerLead: leads > 0 ? budget / leads : null,
    acquisitionCost: customers > 0 ? budget / customers : null,
  };
}

/** Cost per lead = CPC / conversion rate. Used for the "why landing pages matter" curve. */
export const costPerLead = (cpc, conversionRate) => (conversionRate > 0 ? cpc / (conversionRate / 100) : null);
