import { ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroIntro from "@/components/animations/HeroIntro";
import ProjectCard from "@/components/projects/ProjectCard";
import ContactCta from "@/components/sections/ContactCta";
import { GithubIcon } from "@/components/ui/icons";
import PageHeader from "@/components/ui/PageHeader";
import { getProjects } from "@/lib/content";
import { alternates, CONTACT } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("projectsTitle"), description: t("projectsDescription"), alternates: alternates(locale, "/projects") };
}

function Group({ title, text, projects }) {
  return (
    <section className="py-14" aria-label={title}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)]" data-reveal="mask">{title}</h2>
        <p className="text-mist" data-reveal>{text}</p>
      </div>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.slug} data-reveal="scale"><ProjectCard project={p} /></li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProjectsPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, te] = await Promise.all([getTranslations("project"), getTranslations("engineering")]);
  const projects = await getProjects(locale);
  return (
    <>
      <PageHeader title={t("pageHeading")} intro={t("pageIntro")} />
      <HeroIntro />
      <div className="container-x pb-10">
        <Group title={t("client")} text={t("clientText")} projects={projects.filter((p) => p.kind === "client")} />
        <Group title={t("engineering")} text={t("engineeringText")} projects={projects.filter((p) => p.kind === "engineering")} />

        {/* Inside the Code — one quiet strip, not a section. */}
        <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" data-track="github_project_click" data-reveal
          className="theme-dark group mt-6 flex flex-wrap items-center gap-6 rounded-[var(--radius-card)] border border-white/10 bg-[linear-gradient(135deg,#14161d,#0a0b0f)] p-8 transition-colors hover:border-white/25 md:p-10">
          <GithubIcon className="size-9" />
          <span className="min-w-0 flex-1">
            <span className="display block text-[clamp(1.5rem,2.4vw,2rem)]">{te("insideTitle")}</span>
            <span className="mt-2 block max-w-xl text-mist">{te("insideText")}</span>
          </span>
          <span className="btn btn-light">{te("explore")} <ArrowUpRight className="arrow size-4" aria-hidden="true" /></span>
        </a>
      </div>
      <ContactCta />
    </>
  );
}
