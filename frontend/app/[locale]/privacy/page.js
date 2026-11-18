import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroIntro from "@/components/animations/HeroIntro";
import PageHeader from "@/components/ui/PageHeader";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("privacyTitle"), description: t("privacyDescription"), alternates: alternates(locale, "/privacy") };
}

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  return (
    <>
      <PageHeader title={t("heading")} intro={t("updated")} />
      <HeroIntro />
      <div className="container-x max-w-3xl space-y-10 py-20">
        {t.raw("sections").map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-medium">{s.title}</h2>
            <p className="mt-3 leading-relaxed text-white/70">{s.text}</p>
          </section>
        ))}
      </div>
    </>
  );
}
