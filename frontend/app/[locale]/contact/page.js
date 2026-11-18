import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroIntro from "@/components/animations/HeroIntro";
import InquiryForm from "@/components/forms/InquiryForm";
import ContactMethods from "@/components/sections/ContactMethods";
import PageHeader from "@/components/ui/PageHeader";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("contactTitle"), description: t("contactDescription"), alternates: alternates(locale, "/contact") };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  return (
    <>
      <PageHeader title={t("pageHeading")} intro={t("pageIntro")} />
      <HeroIntro />
      <section className="bg-ink pb-28 pt-4 md:pb-36">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <ContactMethods />
          <div data-reveal><InquiryForm /></div>
        </div>
      </section>
    </>
  );
}
