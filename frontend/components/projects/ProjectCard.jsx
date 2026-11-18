import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProjectVisual from "./ProjectVisual";

export function StatusBadge({ status, className = "" }) {
  const t = useTranslations("status");
  const live = status === "live";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[0.7rem] font-medium text-white/85 backdrop-blur-md ${className}`}>
      <span className={`size-1.5 rounded-full ${live ? "pulse-dot bg-emerald-400" : "bg-accent"}`} />
      {t(status)}
    </span>
  );
}

/** Reference-style project card: full-bleed visual, title block at the bottom, rotating arrow. */
export default function ProjectCard({ project, className = "" }) {
  const t = useTranslations("work");
  return (
    <article className={`group relative isolate flex aspect-[4/4.9] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-ink-800 ${className}`}>
      <div className="absolute inset-0 -z-10 transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]">
        <ProjectVisual slug={project.slug} thumbnail={project.thumbnail} />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_22%,rgb(8_9_12/0.8)_52%,rgb(8_9_12/0.97)_72%)]" />
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(70%_50%_at_50%_100%,rgb(170_169_245/0.18),transparent)]" />

      <StatusBadge status={project.status} className="absolute start-5 top-5" />
      {project.github_url && (
        <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} — GitHub`} data-track="github_project_click"
          className="absolute end-[4.25rem] top-5 z-10 grid size-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-ink">
          <GithubIcon className="size-4" />
        </a>
      )}
      <span className="absolute end-5 top-5 grid size-10 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 group-hover:bg-white group-hover:text-ink rtl:-scale-x-100" aria-hidden="true">
        <ArrowUpRight className="size-4" />
      </span>

      <div className="p-6">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white" dir="ltr">{project.title}</p>
        <h3 className="mt-1.5 text-lg text-white/85">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none" data-track="project_view">
            {project.category}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
          {project.technology_tags.slice(0, 3).map((tag) => <li key={tag} className="chip">{tag}</li>)}
        </ul>
        <span className="sr-only">{t("view")}</span>
      </div>
    </article>
  );
}
