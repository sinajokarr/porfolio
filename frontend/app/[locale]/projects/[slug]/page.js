import { ArrowRight, ArrowUpRight, Check, ChevronDown, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroIntro from "@/components/animations/HeroIntro";
import { ArchitectureDiagram, FlowDiagram } from "@/components/projects/ArchitectureDiagram";
import { StatusBadge } from "@/components/projects/ProjectCard";
import ProjectVisual from "@/components/projects/ProjectVisual";
import ContactCta from "@/components/sections/ContactCta";
import { GithubIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getProject, getProjects, projectSlugs } from "@/lib/content";
import { DIAGRAMS } from "@/lib/diagrams";
import { alternates } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projectSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const p = await getProject(locale, slug);
  if (!p) return {};
  return { title: `${p.title} — ${p.category}`, description: p.summary, alternates: alternates(locale, `/projects/${slug}`) };
}

function Bullets({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3 leading-relaxed text-white/80">
          <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />{i}
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [p, all, t] = await Promise.all([getProject(locale, slug), getProjects(locale), getTranslations("project")]);
  if (!p) notFound();
  const diagram = DIAGRAMS[slug];
  const hasDeepDive = p.architecture || diagram || p.challenges?.length || p.decisions?.length;
  const next = all[(all.findIndex((x) => x.slug === slug) + 1) % all.length];

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-ink pt-36 md:pt-44">
        <div aria-hidden="true" className="absolute -z-10 end-[-10%] top-[-10%] size-[44rem] rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.14),transparent)]" />
        <div className="container-x">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-mist hover:text-white" data-hero>
            <ArrowRight className="size-4 rotate-180 rtl:rotate-0" aria-hidden="true" /> {t("back")}
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-3" data-hero>
            <span className="text-sm font-semibold tracking-[0.12em]" dir="ltr">{p.title}</span>
            <StatusBadge status={p.status} />
            <span className="text-sm text-mist">{p.category}</span>
          </div>
          <h1 className="display mt-6 max-w-4xl text-[clamp(2.2rem,5vw,4.2rem)]">
            <span className="block overflow-hidden pb-[0.08em]"><span className="block" data-hero="line">{p.headline || p.title}</span></span>
          </h1>
          <p className="mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-white/70" data-hero>{p.summary}</p>
          <div className="mt-9 flex flex-wrap gap-3" data-hero>
            {p.github_url && (
              <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-light" data-track="github_project_click">
                <GithubIcon /> {t("source")}
              </a>
            )}
            {p.live_url && (
              <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                {t("live")} <ArrowUpRight className="arrow size-4" aria-hidden="true" />
              </a>
            )}
          </div>
          <div className="mt-14 aspect-[16/8] overflow-hidden rounded-[var(--radius-card)] border border-white/10" data-hero="fade">
            <ProjectVisual slug={p.slug} thumbnail={p.thumbnail} />
          </div>
        </div>
      </header>
      <HeroIntro />

      <div className="container-x max-w-5xl space-y-16 py-20 md:py-28">
        {p.note && (
          <p className="flex gap-3 rounded-2xl border border-accent/25 bg-accent/[0.05] p-5 text-white/80" data-reveal>
            <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
            <span><strong className="me-1 text-white">{t("noteTitle")}:</strong>{p.note}</span>
          </p>
        )}

        <div className="grid gap-12 md:grid-cols-2" data-reveal>
          {p.problem && (
            <section>
              <h2 className="text-xl font-medium">{t("problem")}</h2>
              <p className="mt-4 leading-relaxed text-white/70">{p.problem}</p>
            </section>
          )}
          {p.scope && (
            <section>
              <h2 className="text-xl font-medium">{t("scope")}</h2>
              <p className="mt-4 leading-relaxed text-white/70">{p.scope}</p>
            </section>
          )}
        </div>

        {p.features?.length > 0 && (
          <section data-reveal>
            <h2 className="text-xl font-medium">{t("features")}</h2>
            <div className="mt-6"><Bullets items={p.features} /></div>
          </section>
        )}

        <section data-reveal>
          <h2 className="text-xl font-medium">{t("stack")}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">{p.technology_tags.map((tag) => <li key={tag} className="chip !text-sm">{tag}</li>)}</ul>
        </section>

        {hasDeepDive && (
          <details className="group card-dark overflow-hidden" data-reveal>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-7 md:p-9 [&::-webkit-details-marker]:hidden">
              <span>
                <span className="block text-xl font-medium">{t("deepDive")}</span>
                <span className="mt-1 block text-sm text-mist">{t("deepDiveHint")}</span>
              </span>
              <ChevronDown className="size-5 shrink-0 text-white/60 transition-transform duration-500 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="space-y-12 border-t border-white/[0.07] p-7 md:p-9">
              {p.architecture && (
                <div>
                  <h3 className="text-lg font-medium">{t("architecture")}</h3>
                  <p className="mt-3 max-w-3xl leading-relaxed text-white/70">{p.architecture}</p>
                  {diagram && <div className="mt-6"><ArchitectureDiagram diagram={diagram} /></div>}
                </div>
              )}
              {diagram?.flow && (
                <div>
                  <h3 className="text-lg font-medium">{t("flow")}</h3>
                  <div className="mt-5 max-w-2xl"><FlowDiagram diagram={diagram} /></div>
                </div>
              )}
              {p.challenges?.length > 0 && (
                <div><h3 className="mb-5 text-lg font-medium">{t("challenges")}</h3><Bullets items={p.challenges} /></div>
              )}
              {p.decisions?.length > 0 && (
                <div><h3 className="mb-5 text-lg font-medium">{t("decisions")}</h3><Bullets items={p.decisions} /></div>
              )}
            </div>
          </details>
        )}

        {next && next.slug !== slug && (
          <Link href={`/projects/${next.slug}`} className="group flex items-center justify-between gap-6 border-t border-white/[0.07] pt-10" data-reveal>
            <span>
              <span className="text-sm text-mist">{t("next")}</span>
              <span className="display mt-2 block text-[clamp(1.6rem,3vw,2.4rem)] transition-colors group-hover:text-accent-soft" dir="ltr">{next.title}</span>
            </span>
            <ArrowRight className="size-6 text-white/50 transition-transform group-hover:translate-x-1 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        )}
      </div>
      <ContactCta />
    </article>
  );
}
