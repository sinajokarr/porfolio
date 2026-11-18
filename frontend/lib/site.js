export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const CONTACT = {
  name: "Sina Jokar",
  email: "cnajokar11@yahoo.com",
  emailHref: "mailto:cnajokar11@yahoo.com",
  phone: "+90 542 713 01 32",
  phoneHref: "tel:+905427130132",
  whatsapp: "https://wa.me/905427130132",
  linkedin: "https://www.linkedin.com/in/sinajokar/",
  github: "https://github.com/sinajokarr",
};

/** Localized canonical + hreflang alternates for a path like "/services". */
export function alternates(locale, path = "") {
  const languages = Object.fromEntries(["en", "tr", "fa", "ru"].map((l) => [l, `${SITE_URL}/${l}${path}`]));
  return { canonical: `${SITE_URL}/${locale}${path}`, languages: { ...languages, "x-default": `${SITE_URL}/en${path}` } };
}
