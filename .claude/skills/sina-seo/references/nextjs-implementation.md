# Where SEO lives in this repo (Next.js 16 App Router + next-intl)

Paths are relative to the repo root. Re-read the files before editing — this map can drift.

## 1. SEO surface

| Concern | File | Notes |
|---|---|---|
| Locales, RTL | `frontend/i18n/routing.js` | `locales`, `defaultLocale: "en"`, `RTL_LOCALES = ["fa"]`, `dirOf()` |
| Per-locale meta text | `frontend/messages/<locale>.json` → `meta` namespace | `title`, `description`, `servicesTitle`, `projectsTitle`, `aboutTitle`… |
| Root metadata, OG locale, Person schema | `frontend/app/[locale]/layout.js` | `generateMetadata`, `openGraph.locale` map, JSON-LD `knowsLanguage` |
| Page metadata | `frontend/app/[locale]/**/page.js` | each `generateMetadata` should call `alternates(locale, path)` |
| canonical + hreflang | `frontend/lib/site.js` → `alternates(locale, path)` | adds `x-default` → `/en` |
| Sitemap (+ hreflang alternates) | `frontend/app/sitemap.js` | own `LOCALES` constant |
| Robots | `frontend/app/robots.js` | disallows `/backend/` |
| OG image | `frontend/app/[locale]/opengraph-image.js` | localize text per locale |
| Base URL | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_PATH` (`lib/site.js`) | GitHub Pages uses a sub-path: canonical/hreflang must include it |
| Content (services/projects) | `content/services.json`, `content/projects.json`, Django admin | translations come from the API, JSON is the fallback |

## 2. Known risk: locale list is duplicated

The locale list is hard-coded in: `i18n/routing.js`, `lib/site.js` (`alternates`),
`app/sitemap.js` (`LOCALES`), `app/[locale]/layout.js` (`openGraph.locale` map and
`knowsLanguage`). Recommended fix: import `routing.locales` everywhere and keep one
`OG_LOCALE = { en: "en_US", tr: "tr_TR", fa: "fa_IR", ru: "ru_RU", de: "de_DE" }` map in
`lib/site.js`. Also emit `openGraph.alternateLocale` (all other locales).

## 3. Checklist: add German (`de`)

1. `frontend/i18n/routing.js` → add `"de"` to `locales`.
2. Create `frontend/messages/de.json` with every key of `en.json` — **transcreated** using
   `languages.md` DE rules, not machine-translated. Verify key parity with a script
   (same key set as `en.json`).
3. Update every hard-coded locale list from §2 (or do the single-source refactor first).
4. Add `de: "de_DE"` to the OG locale map; add `"de"` to `knowsLanguage`.
5. Content translations for services/projects: add `de` fields in `content/*.json` and the Django
   models/admin (check `backend/apps` for the translation field pattern; add a migration).
6. Language switcher in the header: add Deutsch.
7. Legal: Impressum + Datenschutz content for `de` (see languages.md).
8. Run `npm run lint`, `npm test`, `npm run build` in `frontend/`; run Playwright e2e if
   locale routes are covered; check `/de` renders, `sitemap.xml` lists `/de/...`, hreflang in
   `<head>` lists 5 locales + `x-default`.
9. After deploy: submit sitemap in Search Console; validate with `/seo hreflang <url>`.

## 4. JSON-LD pattern (per locale)

```js
// in a page or layout, server component
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: t("siteName"),               // localized
  description: t("description"),     // localized
  inLanguage: locale,                // "fa", "ru", "de", "en", "tr"
  url: `${SITE_URL}/${locale}`,
  areaServed: [{ "@type": "City", name: "Antalya" }, { "@type": "Country", name: "Türkiye" }, "Worldwide"],
  availableLanguage: ["en", "tr", "fa", "ru", "de"],
  founder: { "@type": "Person", name: "Sina Jokar", sameAs: [CONTACT.linkedin, CONTACT.github] },
};
// <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```
Service pages: `@type: "Service"` with `provider` → the Person/ProfessionalService, `serviceType`,
`areaServed`, `inLanguage`. Add `FAQPage` only for FAQs visible on the page.

## 5. Verification commands

```bash
cd frontend && npm run lint && npm test && npm run build
```
After build, inspect generated `<head>` for a page in each locale: `lang`, `dir`, title,
description, canonical, 5 hreflang + x-default, og:locale.
