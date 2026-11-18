import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ProjectCard from "./ProjectCard";
import WorkCarousel from "./WorkCarousel";

export default function SelectedWork({ projects }) {
  const t = useTranslations("work");
  // Websites first, then software (Array.sort is stable, so the CMS order is kept inside each group).
  const featured = projects.filter((p) => p.featured).sort((a, b) => (a.kind === "client" ? 0 : 1) - (b.kind === "client" ? 0 : 1));
  return (
    <section id="work" className="relative overflow-hidden bg-ink py-24 md:py-32" aria-labelledby="work-title">
      <div aria-hidden="true" className="pointer-events-none absolute -start-40 top-20 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.08),transparent)]" />
      <div className="container-x relative grid gap-12 xl:grid-cols-[minmax(15rem,0.85fr)_3fr] xl:gap-10">
        <div className="relative xl:pb-20">
          <h2 id="work-title" className="display text-[clamp(2rem,2.7vw,2.6rem)]" data-reveal="mask">
            {t("heading1")}
            <br />
            <span className="text-chrome">{t("heading2")}</span>
          </h2>
          <Link href="/projects" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/25 underline-offset-[6px] transition-colors hover:decoration-white" data-reveal>
            {t("all")} <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
        <WorkCarousel prevLabel={t("prev")} nextLabel={t("next")}>
          {featured.map((p) => (
            <li key={p.slug} className="w-[82%] shrink-0 snap-start sm:w-[46%] xl:w-[calc((100%-2.5rem)/3)]" data-reveal="scale">
              <ProjectCard project={p} />
            </li>
          ))}
        </WorkCarousel>
      </div>
    </section>
  );
}
