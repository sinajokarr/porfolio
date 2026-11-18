import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Spotlight from "@/components/ui/Spotlight";
import { Link } from "@/i18n/navigation";
import ServiceIcon from "./ServiceIcon";

/** Ice-white band: three pillars, one line each. The detail lives on the service pages. */
export default function ServicesOverview({ services }) {
  const t = useTranslations("services");
  const primary = services.filter((s) => s.category === "primary");

  return (
    <section id="services" className="relative overflow-hidden bg-ice py-28 text-text-dark md:py-40" aria-labelledby="services-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_0%,#ffffff,transparent_70%),radial-gradient(60%_50%_at_0%_100%,#e3e3f3,transparent_70%)]" />
      <div className="container-x relative grid gap-12 xl:grid-cols-[minmax(15rem,0.9fr)_3fr] xl:gap-8">
        <div className="xl:pt-4">
          <h2 id="services-title" className="display text-[clamp(2.1rem,3.6vw,3.2rem)]" data-reveal="mask">{t("heading")}</h2>
          <Link href="/services" className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline decoration-text-dark/25 underline-offset-[6px] transition-colors hover:decoration-text-dark" data-reveal>
            {t("all")} <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {primary.map((s) => (
            <li key={s.slug} data-reveal>
              <Spotlight tilt className="card-light group flex h-full min-h-[20rem] flex-col p-7 hover:shadow-[0_40px_80px_-40px_rgb(20_22_40/0.45)]">
                <span className="text-text-dark/85"><ServiceIcon name={s.icon} className="size-9" /></span>
                <h3 className="mt-10 text-[1.35rem] font-semibold leading-snug tracking-tight">
                  <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0 after:rounded-[inherit]" data-track="service_inquiry_click">{s.title}</Link>
                </h3>
                <p className="mt-3 flex-1 leading-relaxed text-mist-dark">{s.tagline}</p>
                <span className="mt-8 grid size-11 place-items-center self-end rounded-full bg-white shadow-[0_6px_20px_-8px_rgb(20_22_40/0.35)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 rtl:-scale-x-100" aria-hidden="true">
                  <ArrowUpRight className="size-4" />
                </span>
              </Spotlight>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
