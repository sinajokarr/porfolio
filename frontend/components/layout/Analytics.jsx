"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const KEY = "sj-analytics-consent";

function loadGtm() {
  if (window.__analyticsEnabled) return;
  window.__analyticsEnabled = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(s);
}

/**
 * Tracking stays off until NEXT_PUBLIC_GTM_ID is configured AND the visitor accepts.
 * Clicks on elements with data-track="event_name" become dataLayer events (no personal data).
 */
export default function Analytics() {
  const t = useTranslations("consent");
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (!GTM_ID) return;
    const saved = localStorage.getItem(KEY);
    if (saved === "granted") loadGtm();
    else if (!saved) setTimeout(() => setAsk(true), 1500); // don't compete with the hero

    const onClick = (e) => {
      const el = e.target.closest?.("[data-track]");
      if (el) track(el.dataset.track, { link_url: el.getAttribute("href") || undefined });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!ask) return null;
  const answer = (value) => {
    localStorage.setItem(KEY, value);
    setAsk(false);
    if (value === "granted") loadGtm();
  };
  return (
    <div role="dialog" aria-live="polite" aria-label="Analytics" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-white/10 bg-ink-800/95 p-5 shadow-2xl backdrop-blur-xl">
      <p className="text-sm leading-relaxed text-white/85">{t("text")}</p>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => answer("granted")} className="btn btn-light !min-h-10 !py-2 text-sm">{t("accept")}</button>
        <button type="button" onClick={() => answer("denied")} className="btn btn-ghost !min-h-10 !py-2 text-sm">{t("decline")}</button>
      </div>
    </div>
  );
}
