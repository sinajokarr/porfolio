import { ArrowRight, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkedinIcon, WhatsappIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site";

/** Closing scene from the reference (eclipse over dunes): one sentence, one button, four ways to reach me. */
export default function ContactCta() {
  const t = useTranslations("contact");
  const pills = [
    { href: CONTACT.whatsapp, label: t("whatsapp"), Icon: WhatsappIcon, track: "contact_whatsapp_click", external: true },
    { href: CONTACT.emailHref, label: t("email"), Icon: Mail, track: "contact_email_click" },
    { href: CONTACT.phoneHref, label: t("phone"), Icon: Phone, track: "contact_phone_click" },
    { href: CONTACT.linkedin, label: t("linkedin"), Icon: LinkedinIcon, track: "linkedin_profile_click", external: true },
  ];
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-ink pb-28 pt-32 md:pb-44 md:pt-48" aria-labelledby="contact-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute end-[6%] top-[4%] size-[30rem] max-w-[80vw] rounded-full shadow-[inset_-10px_6px_30px_-8px_rgb(255_255_255/0.55),0_0_120px_-20px_rgb(201_200_255/0.35)] rtl:shadow-[inset_10px_6px_30px_-8px_rgb(255_255_255/0.55),0_0_120px_-20px_rgb(201_200_255/0.35)]" data-parallax="10" />
        <svg className="absolute inset-x-0 bottom-0 h-[55%] w-full" viewBox="0 0 1440 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="dune1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2c36" /><stop offset="1" stopColor="#08090c" /></linearGradient>
            <linearGradient id="dune2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4c58" stopOpacity="0.9" /><stop offset="0.5" stopColor="#15161c" /><stop offset="1" stopColor="#08090c" /></linearGradient>
          </defs>
          <path d="M0 260C240 180 420 230 640 200s420-120 800-60v360H0z" fill="url(#dune1)" opacity="0.7" />
          <path d="M0 360c260-90 520-40 760-90s420-110 680-40v270H0z" fill="url(#dune2)" />
          <path d="M760 270c180-40 420-110 680-40" stroke="#fff" strokeOpacity="0.35" fill="none" />
        </svg>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#08090c_0%,transparent_30%)]" />
      </div>

      <div className="container-x">
        <div className="max-w-2xl">
          <h2 id="contact-title" className="display text-[clamp(2.4rem,4.8vw,4.2rem)]" data-reveal="mask">{t("heading")}</h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70" data-reveal>{t("desc1")}</p>
          <div className="mt-10" data-reveal>
            <Link href="/contact" className="btn btn-light px-8" data-track="service_inquiry_click">
              {t("cta")} <ArrowRight className="arrow size-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2" data-reveal>
            {pills.map(({ href, label, Icon, track, external }) => (
              <li key={label}>
                <a href={href} data-track={track} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="btn btn-ghost !min-h-10 !gap-2 !px-4 !py-2 text-sm">
                  <Icon className="size-4" aria-hidden="true" /> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
