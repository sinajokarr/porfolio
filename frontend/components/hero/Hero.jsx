import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import HeroIntro from "@/components/animations/HeroIntro";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site";
import HeroVisual from "./HeroVisual";

/** Who I am, in one screen: real portrait (2.5D), positioning, headline, two actions. */
export default function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="relative isolate overflow-hidden bg-ink lg:min-h-[100svh]" aria-labelledby="hero-title">
      {/* Atmosphere: periwinkle bloom behind the portrait + reflective horizon. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute start-1/2 top-[4%] size-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.2),transparent)] rtl:translate-x-1/2 lg:start-[66%] lg:top-[2%] lg:size-[min(80rem,95svh)]" />
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[radial-gradient(55%_100%_at_66%_100%,rgb(255_255_255/0.06),transparent_70%)] rtl:bg-[radial-gradient(55%_100%_at_34%_100%,rgb(255_255_255/0.06),transparent_70%)]" />
        <div className="absolute bottom-[3%] end-[-6%] hidden h-px w-[70%] bg-gradient-to-r from-transparent via-white/35 to-transparent blur-[0.5px] lg:block" />
      </div>

      {/* Phones: a block above the text. Desktop: a square on the end side, fading into the page. */}
      <div
        className="relative h-[50svh] min-h-[21rem] w-full [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] lg:absolute lg:bottom-0 lg:start-[66%] lg:h-[100svh] lg:min-h-[44rem] lg:w-[100svh] lg:min-w-[44rem] lg:-translate-x-1/2 lg:[mask-image:linear-gradient(90deg,transparent,black_24%)] rtl:lg:translate-x-1/2 rtl:lg:[mask-image:linear-gradient(270deg,transparent,black_24%)]"
        data-hero="fade"
      >
        <HeroVisual alt={t("portrait")} />
      </div>

      <div className="container-x relative mt-2 pb-16 lg:mt-0 lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:pb-24 lg:pt-36">
        <div className="lg:max-w-[54%]">
          <p className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-1" data-hero>
            <span>{t("eyebrowA")}</span>
            <span aria-hidden="true" className="text-white/40">×</span>
            <span>{t("eyebrowB")}</span>
          </p>
          <h1 id="hero-title" className="display mt-5 text-balance text-[clamp(2.2rem,8.8vw,3.4rem)] text-white lg:mt-7 lg:text-[clamp(2.4rem,3.9vw,3.9rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="block" data-hero="line">{t("line1")}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block" data-hero="line">
                {t("line2Pre")}
                <span className="text-accent-gradient">{t("line2Accent")}</span>
                {t("line2Post")}
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-[1.08rem] leading-relaxed text-white/70 lg:mt-8" data-hero>
            {t("copy")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 lg:mt-11" data-hero>
            <a href="#services" className="btn btn-light px-7">
              {t("primary")}
              <ArrowRight className="arrow size-4" aria-hidden="true" />
            </a>
            <Link href="/contact" className="btn btn-ghost !ps-2" data-track="service_inquiry_click">
              <span className="grid size-8 place-items-center rounded-full bg-white text-ink">
                <MessageCircle className="size-4" aria-hidden="true" />
              </span>
              {t("secondary")}
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 lg:mt-16" data-hero>
            <div className="flex gap-1">
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" data-track="github_project_click" className="grid size-10 place-items-center rounded-full border border-white/12 text-white/65 transition-colors hover:border-white/30 hover:text-white">
                <GithubIcon />
              </a>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" data-track="linkedin_profile_click" className="grid size-10 place-items-center rounded-full border border-white/12 text-white/65 transition-colors hover:border-white/30 hover:text-white">
                <LinkedinIcon />
              </a>
            </div>
            <p className="text-sm leading-relaxed text-white/45">
              {t("location")}
              <br />
              {t("languages")}
            </p>
          </div>
        </div>

        <a href="#services" className="absolute bottom-8 start-[24%] hidden flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-white lg:flex [@media(max-height:850px)]:!hidden" data-hero="fade">
          <span className="scroll-cue grid h-9 w-6 place-items-start justify-center rounded-full border border-white/30 pt-2">
            <span className="h-2 w-0.5 rounded-full bg-white/70" />
          </span>
          {t("scroll")}
        </a>
      </div>
      <HeroIntro />
    </section>
  );
}
