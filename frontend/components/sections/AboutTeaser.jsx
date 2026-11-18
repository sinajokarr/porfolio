import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LinkedinIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site";
import { TechOrbit } from "./TechStack";

/** Homepage: two sentences about me and the tools orbit. The portrait already opened the page. */
export default function AboutTeaser() {
  const t = useTranslations("about");
  const ts = useTranslations("stack");
  return (
    <section id="about" className="bg-ink py-24 md:py-36" aria-labelledby="about-title">
      <div className="container-x">
        <div className="card-dark grid items-center gap-14 overflow-hidden p-8 md:p-14 lg:grid-cols-[1.1fr_1fr]" data-reveal>
          <div>
            <h2 id="about-title" className="display text-[clamp(2rem,3.4vw,3rem)]">{t("heading")}</h2>
            <p className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-white/75">
              {t("p1")} {t("lead")}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-light">
                {t("more")} <ArrowRight className="arrow size-4" aria-hidden="true" />
              </Link>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-track="linkedin_profile_click">
                <LinkedinIcon /> LinkedIn ↗
              </a>
            </div>
          </div>
          <TechOrbit label={ts("heading")} />
        </div>
      </div>
    </section>
  );
}

/** About page: the full story with Sina's portrait (monochrome grade of the supplied photo). */
export function AboutProfile() {
  const t = useTranslations("about");
  const facts = [
    { value: t("facts.languagesValue"), label: t("facts.languages") },
    { value: t("facts.baseValue"), label: t("facts.base") },
  ];
  return (
    <section id="about" className="bg-ink py-20 md:py-28" aria-labelledby="about-title">
      <div className="container-x">
        <div className="card-dark grid overflow-hidden lg:grid-cols-[1.15fr_1fr]" data-reveal>
          <div className="relative z-10 p-8 md:p-14">
            <h2 id="about-title" className="display text-[clamp(2rem,3.4vw,3rem)]">{t("heading")}</h2>
            <div className="mt-7 max-w-xl space-y-4 leading-relaxed text-white/70">
              <p className="text-white">{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
              <p>{t("p4")}</p>
            </div>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-10" data-track="linkedin_profile_click">
              <LinkedinIcon /> {t("linkedin")} ↗
            </a>
          </div>
          <div className="relative min-h-[30rem] overflow-hidden">
            <Image src="/sina-jokar.webp" alt={t("portraitAlt")} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[50%_20%]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,#12141a_0%,transparent_35%),linear-gradient(0deg,#0d0f14_0%,transparent_35%)] rtl:bg-[linear-gradient(270deg,#12141a_0%,transparent_35%),linear-gradient(0deg,#0d0f14_0%,transparent_35%)] max-lg:bg-[linear-gradient(0deg,#0d0f14_0%,transparent_45%)]" />
            <dl className="absolute bottom-6 end-6 hidden w-48 divide-y divide-white/10 rounded-3xl border border-white/10 bg-black/45 px-6 backdrop-blur-xl sm:block">
              {facts.map((f) => (
                <div key={f.label} className="py-5">
                  <dd className="text-[1.5rem] font-medium tracking-tight text-white" dir="auto">{f.value}</dd>
                  <dt className="mt-1 text-xs text-mist">{f.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="card-dark mt-6 p-8 md:p-12" data-reveal>
          <h3 className="text-sm font-medium text-white">{t("focusTitle")}</h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {t.raw("focus").map((f) => (
              <li key={f} className="flex gap-3 text-white/80">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
