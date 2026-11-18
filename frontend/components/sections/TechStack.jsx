import { useTranslations } from "next-intl";
import {
  siCelery, siCss, siDjango, siDocker, siFastapi, siGit, siGithub, siGoogleads, siGoogleanalytics, siGoogletagmanager,
  siHtml5, siJavascript, siLinux, siMysql, siNextdotjs, siPostgresql, siPython, siReact, siRedis,
} from "simple-icons";
import { Monogram } from "@/components/ui/icons";

const GROUPS = [
  { key: "backend", items: [["Python", siPython], ["Django", siDjango], ["Django REST Framework", siDjango], ["FastAPI", siFastapi], ["PostgreSQL", siPostgresql], ["MySQL", siMysql], ["Redis", siRedis], ["Celery", siCelery]] },
  { key: "frontend", items: [["JavaScript", siJavascript], ["React", siReact], ["Next.js", siNextdotjs], ["HTML", siHtml5], ["CSS", siCss]] },
  { key: "engineering", items: [["Git", siGit], ["GitHub", siGithub], ["Docker", siDocker], ["Linux", siLinux], ["REST APIs"], ["Testing"]] },
  { key: "marketing", items: [["Google Ads", siGoogleads], ["Google Analytics 4", siGoogleanalytics], ["Google Tag Manager", siGoogletagmanager], ["Conversion Tracking"], ["Landing Page Optimization"]] },
];

// Orbit: core tools only, in brand colour, like the reference.
const ORBIT = [siPython, siDjango, siReact, siPostgresql, siGoogleanalytics, siGoogleads, siNextdotjs, siDocker];

function Logo({ icon, size = 22 }) {
  const dark = ["000000", "092E20", "1D1D1D"].includes(icon.hex.toUpperCase());
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={icon.path} fill={dark ? "#e8e9ee" : `#${icon.hex}`} />
    </svg>
  );
}

/** Decorative orbit (aria-hidden) with a visually hidden list as the accessible alternative. */
export function TechOrbit({ label }) {
  return (
    <figure data-reveal="scale">
      <div className="orbit relative mx-auto aspect-square w-full max-w-[23rem]" dir="ltr" aria-hidden="true">
        <div className="absolute inset-[8%] rounded-full border border-white/10" />
        <div className="absolute inset-[8%] rotate-[-18deg] scale-y-[0.42] rounded-full border border-accent/40 shadow-[0_0_30px_rgb(170_169_245/0.25)]" />
        <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(170_169_245/0.25),transparent)]" />
        <Monogram className="absolute inset-0 m-auto size-12" />
        <div className="orbit-spin absolute inset-[8%]">
          {ORBIT.map((icon, i) => {
            const a = (i / ORBIT.length) * Math.PI * 2;
            return (
              <div key={icon.slug} className="absolute" style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%`, transform: "translate(-50%,-50%)" }}>
                <div className="orbit-counter grid size-14 place-items-center rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#1d2029,#0d0e13)] shadow-[0_12px_30px_-10px_rgb(0_0_0/0.8)]">
                  <Logo icon={icon} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ul className="sr-only">{ORBIT.map((i) => <li key={i.slug}>{i.title}</li>)}</ul>
      {label && <figcaption className="mt-6 text-center text-sm text-mist">{label}</figcaption>}
    </figure>
  );
}

/** Capabilities & Technologies: grouped by use (the readable content) with the orbit as the visual. */
export default function TechStack() {
  const t = useTranslations("stack");
  return (
    <section id="stack" className="bg-ink pb-24 md:pb-32" aria-labelledby="stack-title">
      <div className="container-x">
        <div className="card-dark grid items-center gap-12 overflow-hidden p-8 md:p-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 id="stack-title" className="display text-[clamp(2rem,3.4vw,3rem)]" data-reveal="mask">{t("heading")}</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-mist" data-reveal>{t("intro")}</p>
            <div className="mt-10 grid gap-8 border-t border-white/[0.07] pt-9 sm:grid-cols-2">
              {GROUPS.map((g) => (
                <div key={g.key} data-reveal>
                  <h3 className="text-sm font-medium text-white">{t(g.key)}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2" dir="ltr">
                    {g.items.map(([name, icon]) => (
                      <li key={name} className="chip gap-2 !py-1.5">
                        {icon && <Logo icon={icon} size={13} />}
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <TechOrbit label="" />
        </div>
      </div>
    </section>
  );
}
