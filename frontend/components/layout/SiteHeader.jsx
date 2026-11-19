"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GithubIcon, LinkedinIcon, Monogram } from "@/components/ui/icons";
import { Link, usePathname } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitch from "./ThemeSwitch";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

export default function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const esc = (e) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a href="#main" className="sr-only z-[70] rounded-full bg-white px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
        {t("skip")}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)] ${
          scrolled ? "border-b border-white/[0.06] bg-ink/70 py-3 backdrop-blur-xl" : "py-5 md:py-7"
        }`}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="Sina Jokar — Home">
            <Monogram className="size-7 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-12" />
            <span className="text-[0.95rem] font-semibold tracking-[0.18em] text-white" dir="ltr">
              SINA JOKAR
            </span>
          </Link>

          <nav aria-label={t("primary")} className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full p-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`relative block rounded-full px-5 py-2 text-sm transition-colors duration-300 ${
                      isActive(l.href) ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <ThemeSwitch />
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-track="linkedin_profile_click" className="hidden size-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white md:grid">
              <LinkedinIcon className="size-4" />
            </a>
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-track="github_project_click" className="hidden size-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white md:grid">
              <GithubIcon className="size-4" />
            </a>
            <LanguageSwitcher />
            <Link href="/contact" className="btn btn-light ms-2 hidden !min-h-10 !px-5 !py-2 text-sm sm:inline-flex" data-track="service_inquiry_click">
              {t("letsTalk")}
              <ArrowUpRight className="arrow size-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-white/15 text-white lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("close") : t("menu")}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-ink/95 backdrop-blur-2xl transition-[opacity,visibility] duration-500 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="pointer-events-none absolute -end-1/3 top-1/4 size-[80vw] rounded-full bg-accent/10 blur-[100px]" />
        <nav aria-label={t("primary")} className="container-x flex h-full flex-col justify-center gap-2 pt-20">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              aria-current={isActive(l.href) ? "page" : undefined}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
              className={`display block py-2 text-[clamp(2.4rem,11vw,3.5rem)] transition-all duration-700 ease-[var(--ease-out-expo)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              } ${isActive(l.href) ? "text-white" : "text-white/55"}`}
            >
              {t(l.key)}
            </Link>
          ))}
          <div className={`mt-10 flex items-center gap-3 transition-opacity delay-500 duration-700 ${open ? "opacity-100" : "opacity-0"}`}>
            <Link href="/contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="btn btn-light">
              {t("letsTalk")} <ArrowUpRight className="arrow size-4" aria-hidden="true" />
            </Link>
            <a href={CONTACT.linkedin} tabIndex={open ? 0 : -1} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid size-12 place-items-center rounded-full border border-white/15">
              <LinkedinIcon />
            </a>
            <a href={CONTACT.github} tabIndex={open ? 0 : -1} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-12 place-items-center rounded-full border border-white/15">
              <GithubIcon />
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
