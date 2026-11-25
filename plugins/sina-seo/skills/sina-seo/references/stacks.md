# Implementing SEO by stack

Detect the stack from the repo (package.json, wp-content, theme files, shopify config) or from the
live HTML (generator meta, asset paths). If no repo access, produce an implementation pack.

## Next.js (App Router)
- Metadata: `generateMetadata` per page → `title`, `description`, `alternates: { canonical,
  languages: { en, tr, fa, ru, de, "x-default" } }`, `openGraph` (`locale`, `alternateLocale`).
- i18n: next-intl / middleware; `<html lang dir>` in `[locale]/layout`; static params per locale.
- `app/sitemap.js` (with `alternates.languages`), `app/robots.js`, `opengraph-image` per locale.
- JSON-LD via `<script type="application/ld+json">` in server components.
- Keep the locale list in one module; import it in sitemap/metadata/schema.
- Verify: `npm run build`, then inspect rendered `<head>` per locale.

## WordPress
- SEO plugin: Yoast / Rank Math / SEOPress (one only). Multilingual: WPML or Polylang
  (hreflang auto) — check settings, don't hand-code duplicates.
- Caching + image optimization plugin; theme `lang`/`dir` for fa (RTL stylesheet).
- Deliver: per-page fields to paste (SEO title, meta, focus keyword, schema type, slug).

## Shopify
- Use `claude-seo:seo-shopify` / `seo-ecommerce`. Markets + Translate & Adapt for languages
  (hreflang handled by Shopify Markets). Edit `theme.liquid` for JSON-LD/meta only when needed;
  watch duplicate `/collections/*/products/*` URLs.

## Django (server-rendered)
- `django.contrib.sitemaps` with `i18n=True` + `alternates=True` + `x_default=True`;
  `i18n_patterns` for URLs; `<html lang dir>` from `get_current_language_bidi`;
  meta via template blocks; translations via gettext / modeltranslation / parler.

## Webflow / Wix / Squarespace / Tilda
- Use built-in SEO fields per page and per locale (Webflow Localization, Wix Multilingual);
  custom code embed for JSON-LD; deliver a click-by-click pack for the CMS.

## Static / other
- Hand-written head tags per language folder; generate sitemap at build; validate hreflang.

## Implementation pack format (no repo access)
`seo/<slug>/deliverables/<page>-<lang>.md` containing: URL, title, meta description, H1,
body (or diff), alt texts, internal links to add, JSON-LD block, redirects, and CMS steps.
