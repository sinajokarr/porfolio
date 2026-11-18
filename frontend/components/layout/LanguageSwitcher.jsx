"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

const LANGS = [
  { code: "en", short: "EN", label: "English" },
  { code: "tr", short: "TR", label: "Türkçe" },
  { code: "fa", short: "FA", label: "فارسی" },
  { code: "ru", short: "RU", label: "Русский" },
];

export default function LanguageSwitcher({ className = "" }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  function choose(code) {
    setOpen(false);
    // Same page, other language (dynamic segments like [slug] are carried over).
    router.replace({ pathname, params }, { locale: code, scroll: false });
  }

  const current = LANGS.find((l) => l.code === locale);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t("language")}: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Globe className="size-4" aria-hidden="true" />
        <span>{current.short}</span>
        <ChevronDown className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <ul
        role="listbox"
        aria-label={t("language")}
        className={`absolute end-0 top-12 z-50 min-w-40 origin-top overflow-hidden rounded-2xl border border-white/10 bg-ink-800/95 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-[var(--ease-out-expo)] ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {LANGS.map((l) => (
          <li key={l.code} role="option" aria-selected={l.code === locale}>
            <button
              type="button"
              lang={l.code}
              onClick={() => choose(l.code)}
              tabIndex={open ? 0 : -1}
              className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-start text-sm text-white/85 hover:bg-white/5"
            >
              <span>{l.label}</span>
              {l.code === locale && <Check className="size-4 text-accent" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
