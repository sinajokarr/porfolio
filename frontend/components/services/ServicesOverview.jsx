import { ArrowUpRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Spotlight from "@/components/ui/Spotlight";
import { Link } from "@/i18n/navigation";
import ServiceIcon from "./ServiceIcon";

/**
 * What I offer: three equal cards. Business value first (heading + one sentence), then five
 * capabilities, then one link to the service page where the detail lives.
 */
export default function ServicesOverview({ services }) {
  const t = useTranslations("services");
  const primary = services.filter((s) => s.category === "primary");

  return (
    <section id="services" className="relative overflow-hidden bg-ice py-28 text-text-dark md:py-36" aria-labelledby="services-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,#ffffff,transparent_70%),radial-gradient(60%_50%_at_0%_100%,#e3e3f3,transparent_70%)]" />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <h2 id="services-title" className="display text-[clamp(2.1rem,3.6vw,3.2rem)]" data-reveal="mask">{t("heading")}</h2>
          <p className="mt-5 leading-relaxed text-mist-dark" data-reveal>{t("intro")}</p>
        </div>
        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {primary.map((s) => (
            <li key={s.slug} data-reveal>
              <Spotlight tilt className="card-light group flex h-full flex-col p-8 hover:shadow-[0_40px_80px_-40px_rgb(20_22_40/0.45)]">
                <div className="flex items-center gap-3 text-text-dark/85">
                  <ServiceIcon name={s.icon} className="size-7" />
                  <span className="text-sm font-medium">{s.title}</span>
                </div>
                <h3 className="mt-8 text-[1.45rem] font-semibold leading-snug tracking-tight">{s.tagline}</h3>
                <p className="mt-3 leading-relaxed text-mist-dark">{s.summary}</p>
                <ul className="mt-7 flex-1 space-y-2.5 border-t border-line-dark pt-6">
                  {s.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-3 text-[0.95rem]">
                      <Check className="mt-1 size-4 shrink-0 text-accent-strong" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-8 flex items-center justify-between gap-4 text-sm font-medium after:absolute after:inset-0 after:rounded-[inherit]"
                  data-track="service_inquiry_click"
                >
                  {t("explore")}
                  <span className="grid size-10 place-items-center rounded-full bg-white shadow-[0_6px_20px_-8px_rgb(20_22_40/0.35)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 rtl:-scale-x-100" aria-hidden="true">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </Spotlight>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
