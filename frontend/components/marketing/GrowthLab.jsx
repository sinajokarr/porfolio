"use client";

import { ArrowRight, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { costPerLead, simulateFunnel } from "@/lib/growth";

const INPUTS = [
  { key: "budget", min: 200, max: 10000, step: 100, unit: "currency" },
  { key: "cpc", min: 0.2, max: 10, step: 0.1, unit: "currency2" },
  { key: "conversion", min: 0.5, max: 15, step: 0.5, unit: "percent" },
  { key: "close", min: 1, max: 60, step: 1, unit: "percent" },
];
const DEFAULTS = { budget: 1500, cpc: 1.2, conversion: 4, close: 20 };

/** Smoothly animates a displayed number toward its target (rAF, no library). */
function useTween(value, ms = 600) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const dur = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
    const start = performance.now();
    const a = from.current;
    let raf;
    const tick = (now) => {
      const p = dur ? Math.min((now - start) / dur, 1) : 1;
      const v = a + (value - a) * (1 - (1 - p) ** 3);
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

function Metric({ label, value, format, highlight = false }) {
  const v = useTween(value ?? 0);
  return (
    <div className={highlight ? "rounded-2xl border border-accent/50 bg-accent/[0.07] px-5 py-4 shadow-[0_0_40px_-14px_rgb(170_169_245/0.7)]" : ""}>
      <p className={`font-medium tabular-nums tracking-tight text-white ${highlight ? "text-[clamp(1.5rem,2.4vw,2rem)]" : "text-[clamp(1.4rem,2.2vw,1.9rem)]"}`}>
        {value == null ? "—" : format(v)}
      </p>
      <p className="mt-1 text-xs text-mist">{label}</p>
    </div>
  );
}

function CplChart({ cpc, conversion, t, fmtMoney }) {
  const W = 600, H = 230, PAD = 28;
  const xs = Array.from({ length: 56 }, (_, i) => 1 + i * 0.2); // 1% … 12%
  const max = costPerLead(cpc, 1);
  const x = (c) => PAD + ((c - 1) / 11) * (W - PAD * 2);
  const y = (v) => H - PAD - (Math.min(v, max) / max) * (H - PAD * 2);
  const d = xs.map((c, i) => `${i ? "L" : "M"}${x(c).toFixed(1)},${y(costPerLead(cpc, c)).toFixed(1)}`).join(" ");
  const cur = Math.min(Math.max(conversion, 1), 12);
  const cx = x(cur), cy = y(costPerLead(cpc, cur));
  const gid = useId();
  return (
    <figure dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t("chartTitle")}>
        <defs>
          <linearGradient id={`${gid}-l`} x1="0" x2="1">
            <stop offset="0" stopColor="#818cf8" stopOpacity="0.35" />
            <stop offset="1" stopColor="#c9c8ff" />
          </linearGradient>
          <linearGradient id={`${gid}-a`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#aaa9f5" stopOpacity="0.22" />
            <stop offset="1" stopColor="#aaa9f5" stopOpacity="0" />
          </linearGradient>
          <filter id={`${gid}-g`}><feGaussianBlur stdDeviation="4" /></filter>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - PAD * 2)} y2={PAD + f * (H - PAD * 2)} stroke="white" strokeOpacity="0.06" />
        ))}
        <path d={`${d} L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`} fill={`url(#${gid}-a)`} />
        <path d={d} fill="none" stroke={`url(#${gid}-l)`} strokeWidth="2.5" strokeLinecap="round" />
        {[2, 4, 6, 8, 10, 12].map((c) => (
          <circle key={c} cx={x(c)} cy={y(costPerLead(cpc, c))} r="3.5" fill="#0b0d12" stroke="#c9c8ff" strokeWidth="1.5" />
        ))}
        <line x1={cx} x2={cx} y1={cy} y2={H - PAD} stroke="#aaa9f5" strokeOpacity="0.5" strokeDasharray="3 4" className="transition-all duration-500" />
        <circle cx={cx} cy={cy} r="10" fill="#aaa9f5" opacity="0.5" filter={`url(#${gid}-g)`} className="transition-all duration-500" />
        <circle cx={cx} cy={cy} r="5" fill="#fff" className="transition-all duration-500" />
        <text x={Math.min(cx + 12, W - 150)} y={Math.max(cy - 12, 16)} fill="#fff" fontSize="13" className="transition-all duration-500">
          {t("you")}: {fmtMoney(costPerLead(cpc, cur))}
        </text>
        {[1, 4, 8, 12].map((c) => (
          <text key={c} x={x(c)} y={H - 6} fill="#a7aab5" fontSize="11" textAnchor="middle">{c}%</text>
        ))}
      </svg>
      <figcaption className="mt-2 text-sm text-mist">{t("chartCaption")}</figcaption>
    </figure>
  );
}

/** Light band for the controls, dark glass dashboard for the result — the reference's analytics panel. */
export default function GrowthLab() {
  const t = useTranslations("growth");
  const locale = useLocale();
  const [v, setV] = useState(DEFAULTS);
  const r = useMemo(() => simulateFunnel({ budget: v.budget, cpc: v.cpc, conversionRate: v.conversion, closeRate: v.close }), [v]);

  const nf = useMemo(() => {
    const lang = { en: "en-GB", tr: "tr-TR", fa: "fa-IR", ru: "ru-RU" }[locale];
    const money = new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
    const money2 = new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const int = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });
    const one = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
    const pct = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });
    return {
      currency: (n) => money.format(n),
      currency2: (n) => money2.format(n),
      int: (n) => int.format(Math.round(n)),
      one: (n) => one.format(n),
      percent: (n) => `${pct.format(n)}%`,
    };
  }, [locale]);

  return (
    <section id="growth-lab" className="relative overflow-hidden bg-ice py-28 text-text-dark md:py-40" aria-labelledby="growth-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_0%_100%,#fff,transparent_70%),radial-gradient(60%_50%_at_100%_0%,#e3e3f3,transparent_70%)]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.8fr_1.4fr] lg:items-center lg:gap-20">
        <div>
          <p className="eyebrow !text-mist-dark" data-reveal>{t("eyebrow")}</p>
          <h2 id="growth-title" className="display mt-4 text-[clamp(2.1rem,3.6vw,3.2rem)]" data-reveal="mask">{t("heading")}</h2>
          <p className="mt-6 max-w-md leading-relaxed text-mist-dark" data-reveal>{t("copy")}</p>

          <fieldset className="mt-10 space-y-6" data-reveal>
            <legend className="sr-only">{t("inputs")}</legend>
            {INPUTS.map((inp) => {
              const fill = ((v[inp.key] - inp.min) / (inp.max - inp.min)) * 100;
              return (
                <div key={inp.key}>
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <label htmlFor={`gl-${inp.key}`} className="text-sm text-text-dark/80">{t(inp.key)}</label>
                    <output htmlFor={`gl-${inp.key}`} className="font-medium tabular-nums">{nf[inp.unit](v[inp.key])}</output>
                  </div>
                  <input
                    id={`gl-${inp.key}`}
                    type="range"
                    className="range range-light"
                    min={inp.min}
                    max={inp.max}
                    step={inp.step}
                    value={v[inp.key]}
                    style={{ "--fill": `${fill}%` }}
                    onChange={(e) => setV((prev) => ({ ...prev, [inp.key]: Number(e.target.value) }))}
                  />
                </div>
              );
            })}
          </fieldset>
        </div>

        <div className="card-dark p-5 md:p-8" data-reveal="scale">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="chip gap-2 !py-1.5">
              <span className="size-2 rounded-full bg-[conic-gradient(#4285f4_0_25%,#34a853_0_50%,#fbbc05_0_75%,#ea4335_0)]" aria-hidden="true" />
              Google Ads · {t("estimated")}
            </span>
            <span className="chip !py-1.5">{nf.currency(v.budget)} / {t("perMonth")}</span>
          </div>

          <div className="mt-6"><CplChart cpc={v.cpc} conversion={v.conversion} t={t} fmtMoney={nf.currency2} /></div>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-x-3 border-t border-white/[0.07] pt-6" aria-live="polite">
            <Metric label={t("clicks")} value={r.clicks} format={nf.int} />
            <ArrowRight className="size-4 text-white/25 rtl:-scale-x-100" aria-hidden="true" />
            <Metric label={t("leads")} value={r.leads} format={nf.one} />
            <ArrowRight className="size-4 text-white/25 rtl:-scale-x-100" aria-hidden="true" />
            <Metric label={t("customers")} value={r.customers} format={nf.one} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-live="polite">
            <Metric label={t("cpl")} value={r.costPerLead} format={nf.currency} highlight />
            <Metric label={t("cac")} value={r.acquisitionCost} format={nf.currency} highlight />
          </div>

          <p className="mt-6 flex gap-2.5 text-sm text-white/60">
            <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </section>
  );
}
