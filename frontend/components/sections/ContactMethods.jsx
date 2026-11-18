import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/ui/icons";
import { CONTACT } from "@/lib/site";

/** Direct-contact cards for the /contact page, next to the inquiry form. */
export default function ContactMethods() {
  const t = useTranslations("contact");
  const methods = [
    { href: CONTACT.whatsapp, label: t("whatsapp"), value: CONTACT.phone, Icon: WhatsappIcon, track: "contact_whatsapp_click", external: true },
    { href: CONTACT.emailHref, label: t("email"), value: CONTACT.email, Icon: Mail, track: "contact_email_click" },
    { href: CONTACT.phoneHref, label: t("phone"), value: CONTACT.phone, Icon: Phone, track: "contact_phone_click" },
    { href: CONTACT.linkedin, label: t("linkedin"), value: "in/sinajokar", Icon: LinkedinIcon, track: "linkedin_profile_click", external: true },
    { href: CONTACT.github, label: "GitHub", value: "github.com/sinajokarr", Icon: GithubIcon, track: "github_project_click", external: true },
  ];
  return (
    <div>
      <ul className="space-y-3">
        {methods.map(({ href, label, value, Icon, track, external }) => (
          <li key={label} data-reveal>
            <a href={href} data-track={track} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.06]">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:scale-105">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-mist">{label}</span>
                <span className="block truncate text-[0.95rem] text-white" dir="ltr">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex items-center gap-2 text-sm text-mist" data-reveal>
        <MapPin className="size-4" aria-hidden="true" /> {t("location")}
      </p>
    </div>
  );
}
