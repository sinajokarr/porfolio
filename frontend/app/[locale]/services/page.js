import { ArrowUpRight, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroIntro from "@/components/animations/HeroIntro";
import ContactCta from "@/components/sections/ContactCta";
import ServiceIcon from "@/components/services/ServiceIcon";
import PageHeader from "@/components/ui/PageHeader";
import Spotlight from "@/components/ui/Spotlight";
import { Link } from "@/i18n/navigation";
import { getServices } from "@/lib/content";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("servicesTitle"), description: t("servicesDescription"), alternates: alternates(locale, "/services") };
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const services = await getServices(locale);
  const primary = services.filter((s) => s.category === "primary");
  const specialized = services.filter((s) => s.category === "specialized");

  return (
    <>
      <PageHeader title={t("heading")} intro={t("intro")} />
      <HeroIntro />
      <section className="bg-ice py-20 text-text-dark md:py-28" aria-label={t("core")}>
        <div className="container-x space-y-6">
          {primary.map((s, i) => (
            <Spotlight key={s.slug} className="card-light grid gap-10 p-8 md:p-12 lg:grid-cols-[1fr_1.1fr]" data-reveal>
              <div>
                <div className="flex items-center gap-4">
                  <ServiceIcon name={s.icon} className="size-9" />
                  <span className="font-mono text-sm text-mist-dark" dir="ltr">0{i + 1}</span>
                </div>
                <h2 className="mt-7 text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold tracking-tight">{s.title}</h2>
                <p className="mt-2 text-lg text-mist-dark">{s.tagline}</p>
                <p className="mt-6 leading-relaxed text-text-dark/75">{s.summary}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/services/${s.slug}`} className="btn btn-dark">{t("explore")} <ArrowUpRight className="arrow size-4" aria-hidden="true" /></Link>
                  <Link href={`/contact?service=${s.slug}`} className="btn border border-line-dark" data-track="service_inquiry_click">{s.cta}</Link>
                </div>
              </div>
              <div>
                <p className="eyebrow !text-mist-dark">{t("benefits")}</p>
                <ul className="mt-5 space-y-3">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-accent-strong" aria-hidden="true" />{b}</li>
                  ))}
                </ul>
              </div>
            </Spotlight>
          ))}
        </div>
      </section>
      <section className="bg-ink py-20 md:py-28" aria-labelledby="spec-title">
        <div className="container-x">
          <p className="eyebrow" data-reveal>{t("specializedEyebrow")}</p>
          <h2 id="spec-title" className="display mt-4 text-[clamp(1.8rem,3vw,2.6rem)]" data-reveal="mask">{t("specializedHeading")}</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialized.map((s) => (
              <li key={s.slug} data-reveal>
                <Spotlight className="card-dark group h-full p-7">
                  <ServiceIcon name={s.icon} className="size-7 text-white/80" />
                  <h3 className="mt-6 text-lg font-medium">
                    <Link href={`/services/${s.slug}`} className="after:absolute after:inset-0">{s.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{s.summary}</p>
                  <ArrowUpRight className="mt-6 size-5 text-white/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-white rtl:-scale-x-100" aria-hidden="true" />
                </Spotlight>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
