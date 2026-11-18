"use client";

/**
 * Pushes events to GTM's dataLayer. Does nothing unless a GTM/GA4 id is configured AND the
 * visitor accepted analytics. Never pass form contents or personal data here.
 */
export function track(event, params = {}) {
  if (typeof window === "undefined" || !window.__analyticsEnabled) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
