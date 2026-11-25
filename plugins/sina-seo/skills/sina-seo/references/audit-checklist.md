# Audit checklist (use when claude-seo specialists are unavailable, or to cross-check them)

Output each finding: `P1|P2|P3 | language | issue | evidence (URL / file:line) | fix | effort`.

## Crawl & index
- robots.txt allows important paths; no accidental `Disallow: /`; sitemap declared.
- XML sitemap valid, only 200/indexable canonical URLs, all languages, `lastmod` honest.
- No `noindex` on money pages; no canonical pointing to other language/version.
- Status codes: 4xx/5xx, redirect chains/loops, HTTP→HTTPS, www/non-www consolidated.
- JS rendering: key content and links present in server HTML.
- Faceted/parameter URLs controlled (canonical, noindex, or blocked).

## International
- `<html lang>` (+ `dir="rtl"` for fa) correct per page.
- hreflang: every language version lists all others + itself + `x-default`; absolute URLs;
  return links; valid codes (`fa`, `ru`, `de`, `en`, `tr`); same set in sitemap if used there.
- No auto-redirect by IP/Accept-Language on content URLs; language switcher links to equivalents.
- Content truly localized (not machine-translated boilerplate); currency/units/legal per market.

## On-page
- Unique title (≤ limits in languages.md), description, single H1 per page per language.
- Heading hierarchy, keyword in title/H1/first paragraph naturally, descriptive anchors.
- Images: localized `alt`, modern formats, dimensions set, lazy below the fold.
- Internal links: money pages linked from nav/hubs; no orphans; same-language linking.

## Content & E-E-A-T
- Each money page answers: what, for whom, price signal, process, proof, CTA.
- Author/company info, credentials, real reviews/cases, last-updated dates (YMYL).
- Thin/duplicate pages merged or improved; AI-tell phrasing removed.

## Structured data
- Organization/LocalBusiness/Person + Service/Product/Article as applicable; `inLanguage`;
  `FAQPage` only for visible FAQs; valid JSON-LD; no fake ratings.

## Performance & UX
- Core Web Vitals: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (mobile). Fonts per script with swap.
- Mobile layout for RTL and long de/ru strings; tap targets; no intrusive interstitials.

## Local & off-page
- GBP complete per location; NAP identical everywhere; reviews velocity & replies per language;
  Yandex Business for ru markets; relevant citations/directories.
- Backlink profile: toxic patterns, competitor gaps, digital PR opportunities.

## GEO / AI search
- AI crawlers not blocked unintentionally; entity statements; answer-first passages; FAQs;
  consistent brand name per script; citations in trusted sources.

## Tracking
- GA4 + GTM (or equivalent) installed with consent; conversions defined (form, call, WhatsApp,
  purchase); Search Console + Bing + Yandex Webmaster verified.
