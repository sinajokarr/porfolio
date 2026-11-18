import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroIntro from "@/components/animations/HeroIntro";
import About from "@/components/sections/About";
import ContactCta from "@/components/sections/ContactCta";
import Process from "@/components/sections/Process";
import TechStack from "@/components/sections/TechStack";
import PageHeader from "@/components/ui/PageHeader";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("aboutTitle"), description: t("aboutDescription"), alternates: alternates(locale, "/about") };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("heading")} />
      <HeroIntro />
      <About full />
      <Process />
      <TechStack />
      <ContactCta />
    </>
  );
}
