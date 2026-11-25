# Industry playbooks

Pick the closest; combine if hybrid. Each lists: page architecture, schema, local, content
engines, KPIs, pitfalls. Always adapt per language market (`languages.md`).

## A. Local service business (clinic, dentist, beauty, lawyer, repair, agency office)
- Pages: one page **per service** (per language), location page per real branch, About/team
  (credentials), Reviews, Prices/FAQ, Contact with map.
- Schema: `LocalBusiness` subtype (`Dentist`, `MedicalClinic`, `LegalService`…), `Service`,
  `FAQPage` (visible FAQs), `Review` only for first-party real reviews, `BreadcrumbList`.
- Local: GBP (categories, services, photos, posts, Q&A, review flow in each language), NAP
  everywhere, local citations, Yandex Business for ru markets.
- Content: cost guides, before/after with consent, procedure explainers, "[service] in [city] for
  foreigners" per language.
- Health/legal = YMYL: author credentials, medical/legal review dates, no guarantees.
- KPIs: map-pack rank, calls/WhatsApp clicks, bookings.

## B. Real estate (agency, developer, rentals)
- Pages: city/district hubs (Antalya → Konyaaltı, Lara…), property type hubs (apartments, villas,
  land), listing pages, "buying property in Türkiye as a foreigner" guides per language
  (citizenship by investment, tapu, residence permit, taxes), developer/project pages.
- Schema: `RealEstateAgent`, `Offer`/`Product`-style for listings only where valid,
  `Place`, `FAQPage`, `BreadcrumbList`.
- Pitfalls: thin/duplicate listing pages, sold listings → keep with status or 301 to hub,
  faceted URLs → canonical/noindex rules, portal competition (target long-tail + guides).
- Per language: ru/fa/de buyers search legal & process questions heavily; tr searches price & district.
- KPIs: lead forms per hub, WhatsApp clicks, viewing requests.

## C. Hospitality & tourism (hotel, tour, restaurant, transfer)
- Pages: rooms/tours/menus per language, location & how-to-get-there, seasonal landing pages,
  events. Schema: `Hotel`/`LodgingBusiness`, `TouristTrip`, `Restaurant` + `Menu`, `Event`.
- Local: GBP + Tripadvisor + Yandex Maps; reviews in each language.
- KPIs: direct bookings vs OTA, reservation clicks.

## D. E-commerce
- Delegate deep checks to `claude-seo:seo-ecommerce` (and `seo-shopify` on Shopify).
- Pages: category (main money pages), product, brand, buying guides, comparison.
- Schema: `Product` + `Offer` + `AggregateRating` (real), `BreadcrumbList`, `Organization`.
- Pitfalls: faceted navigation/index bloat, out-of-stock handling, duplicate descriptions,
  hreflang across currencies. TR legal pages required.
- KPIs: organic revenue, category rankings, Merchant Center visibility.

## E. SaaS / B2B / tech services
- Pages: product/features, use-case & industry pages, integrations, pricing, comparison/alternatives
  (`claude-seo:seo-competitor-pages`), docs/blog clusters, case studies.
- Schema: `SoftwareApplication`, `Organization`, `FAQPage`, `Article`.
- GEO: strong entity statements; `claude-seo:seo-geo` + `seo-agentic`.
- KPIs: demo/sign-up conversions from organic, share of AI citations.

## F. Professional services & personal brand (developer, consultant, freelancer, coach)
- Pages: service pages, case studies with numbers, about (E-E-A-T), process, pricing signal, contact.
- Schema: `Person` + `ProfessionalService`, `sameAs` (LinkedIn, GitHub…), `Service`.
- KPIs: inquiries, branded search growth.

## G. Education / courses / immigration consultancies
- Pages: program/course pages, requirements & cost guides per country, FAQs, success stories.
- Schema: `Course`, `EducationalOrganization`, `FAQPage`.
- YMYL-ish: dates, sources, legal disclaimers; update cadence.

## H. Publisher / blog
- Topic clusters (`claude-seo:seo-cluster`), author pages, freshness updates, internal linking,
  `Article`/`NewsArticle` schema, Discover-friendly images.

## Universal 90-day skeleton
| Weeks | Focus |
|---|---|
| 1–2 | Tracking (GA4/GTM/conversions), GSC/Yandex/Bing setup, P1 technical fixes, titles/meta, schema, GBP |
| 3–6 | Money pages per language, internal linking, E-E-A-T/trust pages, legal pages per market |
| 7–12 | Clusters & guides per language, comparison pages, reviews engine, digital PR/links, AI-search citability |
| ongoing | Monthly report, drift monitoring, refresh decaying pages |
