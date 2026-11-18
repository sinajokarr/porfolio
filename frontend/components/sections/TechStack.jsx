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
      <div className="orbit relative mx-auto aspect-square w-full max-w-[23rem]" aria-hidden="true">
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
      <figcaption className="mt-6 text-center text-sm text-mist">{label}</figcaption>
    </figure>
  );
}

/** Full grouped list — used on the About page, where the depth belongs. */
export default function TechStack() {
  const t = useTranslations("stack");
  return (
    <section id="stack" className="bg-ink py-24 md:py-32" aria-labelledby="stack-title">
      <div className="container-x">
        <div className="card-dark p-8 md:p-14">
          <h2 id="stack-title" className="display text-[clamp(2rem,3.4vw,3rem)]" data-reveal="mask">{t("heading")}</h2>
          <p className="mt-5 max-w-lg leading-relaxed text-mist" data-reveal>{t("intro")}</p>
          <div className="mt-12 grid gap-8 border-t border-white/[0.07] pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {GROUPS.map((g) => (
              <div key={g.key} data-reveal>
                <h3 className="text-sm font-medium text-white">{t(g.key)}</h3>
                <ul className="mt-4 space-y-2.5" dir="ltr">
                  {g.items.map(([name, icon]) => (
                    <li key={name} className="flex items-center gap-2.5 text-[0.93rem] text-white/75 rtl:justify-end">
                      {icon ? <Logo icon={icon} size={15} /> : <span className="grid size-[15px] place-items-center"><span className="size-1 rounded-full bg-accent" /></span>}
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
