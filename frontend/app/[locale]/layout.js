import { Geist, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import MotionRoot from "@/components/animations/MotionRoot";
import Analytics from "@/components/layout/Analytics";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { dirOf, routing } from "@/i18n/routing";
import { alternates, CONTACT, SITE_URL } from "@/lib/site";
import "../globals.css";

const geist = Geist({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-geist", display: "swap" });
const vazir = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s — ${t("siteName")}` },
    description: t("description"),
    alternates: alternates(locale),
    openGraph: {
      type: "website",
      siteName: "Sina Jokar",
      locale: { en: "en_US", tr: "tr_TR", fa: "fa_IR", ru: "ru_RU" }[locale],
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}`,
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport = { themeColor: "#08090c", colorScheme: "dark" };

// Runs before paint: hide reveal targets only when motion is allowed.
const motionScript = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')`;

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Sina Jokar",
        jobTitle: "Full-Stack Developer",
        url: SITE_URL,
        image: `${SITE_URL}/sina-jokar.webp`,
        email: `mailto:${CONTACT.email}`,
        telephone: "+905427130132",
        address: { "@type": "PostalAddress", addressLocality: "Antalya", addressCountry: "TR" },
        sameAs: [CONTACT.linkedin, CONTACT.github],
        knowsLanguage: ["en", "tr", "fa", "ru"],
      },
      {
        "@type": "ProfessionalService",
        name: "Sina Jokar",
        description: t("description"),
        url: `${SITE_URL}/${locale}`,
        founder: { "@id": `${SITE_URL}/#person` },
        areaServed: ["TR", "EU", "GB"],
        address: { "@type": "PostalAddress", addressLocality: "Antalya", addressCountry: "TR" },
      },
    ],
  };

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${geist.variable} ${vazir.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="min-h-dvh bg-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <MotionRoot />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
