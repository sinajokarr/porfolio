import { ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroIntro from "@/components/animations/HeroIntro";
import GrowthLab from "@/components/marketing/GrowthLab";
import ContactCta from "@/components/sections/ContactCta";
import ServiceIcon from "@/components/services/ServiceIcon";
import PageHeader from "@/components/ui/PageHeader";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getService, getServices, serviceSlugs } from "@/lib/content";
import { alternates } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => serviceSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const s = await getService(locale, slug);
  if (!s) return {};
  return { title: s.title, description: s.summary, alternates: alternates(locale, `/services/${slug}`) };
}

export default async function ServicePage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [s, all, t] = await Promise.all([getService(locale, slug), getServices(locale), getTranslations("services")]);
  if (!s) notFound();
  const others = all.filter((o) => o.slug !== slug && o.category === "primary").slice(0, 3);

  return (
    <>
      <PageHeader back={{ href: "/services", label: t("back") }} eyebrow={s.title} title={s.tagline || s.title} intro={s.summary}>
        <div className="mt-10 flex flex-wrap gap-3" data-hero>
          <Link href={`/contact?service=${s.slug}`} className="btn btn-light" data-track="service_inquiry_click">{s.cta} <ArrowRight className="arrow size-4" aria-hidden="true" /></Link>
        </div>
      </PageHeader>
      <HeroIntro />
      <section className="bg-ice py-20 text-text-dark md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-5 text-[1.08rem] leading-relaxed text-text-dark/80" data-reveal>
            <ServiceIcon name={s.icon} className="mb-8 size-10 text-text-dark" />
            {s.description.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className="space-y-6">
            <div className="card-light p-8" data-reveal>
              <h2 className="eyebrow !text-mist-dark">{t("included")}</h2>
              <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[0.95rem]"><Check className="mt-1 size-4 shrink-0 text-accent-strong" aria-hidden="true" />{f}</li>
                ))}
              </ul>
            </div>
            {s.benefits.length > 0 && (
              <div className="rounded-[var(--radius-card)] bg-ink p-8 text-white" data-reveal>
                <h2 className="eyebrow">{t("benefits")}</h2>
                <ul className="mt-5 space-y-3">
                  {s.benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-white/85"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
      {others.length > 0 && (
        <section className="bg-ink pt-20" aria-labelledby="other-title">
          <div className="container-x">
            <h2 id="other-title" className="eyebrow">{t("other")}</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/services/${o.slug}`} className="card-dark group flex items-center gap-4 p-6 transition-colors hover:border-white/25">
                    <ServiceIcon name={o.icon} className="size-6 text-white/80" />
                    <span className="flex-1">{o.title}</span>
                    <ArrowRight className="size-4 text-white/40 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {/* The marketing simulator lives where it is relevant: on the performance-marketing page. */}
      {s.slug === "performance-marketing" && <GrowthLab />}
      <ContactCta />
    </>
  );
}
