import { useTranslations } from "next-intl";
import { GithubIcon, LinkedinIcon, Monogram, WhatsappIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site";

export default function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink pb-10 pt-16">
      <div className="container-x grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Monogram />
            <span className="font-semibold tracking-[0.18em]" dir="ltr">SINA JOKAR</span>
          </div>
          <p className="mt-5 max-w-xs text-mist">{t("footer.tagline")}</p>
          <p className="mt-2 text-sm text-mist/70">{t("contact.location")}</p>
        </div>
        <nav aria-label={t("footer.explore")}>
          <p className="eyebrow">{t("footer.explore")}</p>
          <ul className="mt-5 space-y-3 text-white/80">
            {["services", "projects", "about", "contact"].map((k) => (
              <li key={k}>
                <Link href={`/${k}`} className="transition-colors hover:text-white">{t(`nav.${k}`)}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow">{t("footer.connect")}</p>
          <ul className="mt-5 space-y-3 text-white/80">
            <li><a href={CONTACT.emailHref} data-track="contact_email_click" className="hover:text-white" dir="ltr">{CONTACT.email}</a></li>
            <li><a href={CONTACT.phoneHref} data-track="contact_phone_click" className="hover:text-white" dir="ltr">{CONTACT.phone}</a></li>
          </ul>
          <div className="mt-6 flex gap-2">
            {[
              { href: CONTACT.whatsapp, label: "WhatsApp", Icon: WhatsappIcon, track: "contact_whatsapp_click" },
              { href: CONTACT.linkedin, label: "LinkedIn", Icon: LinkedinIcon, track: "linkedin_profile_click" },
              { href: CONTACT.github, label: "GitHub", Icon: GithubIcon, track: "github_project_click" },
            ].map(({ href, label, Icon, track }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-track={track}
                className="grid size-11 place-items-center rounded-full border border-white/12 text-white/75 transition-all hover:-translate-y-0.5 hover:border-white/30 hover:text-white">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container-x mt-14">
        <div className="hairline" />
        <div className="mt-6 flex flex-col justify-between gap-3 text-sm text-mist/70 sm:flex-row">
          <p>© {year} Sina Jokar. {t("footer.rights")}</p>
          <Link href="/privacy" className="hover:text-white">{t("footer.privacy")}</Link>
        </div>
      </div>
    </footer>
  );
}
