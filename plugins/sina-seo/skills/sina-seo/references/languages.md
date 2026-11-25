# Language playbook — fa · ru · de · en · tr (business-agnostic)

Use for every task in that language. Keyword *patterns* here are templates: combine with the
business's own services and locations, then validate with real data (GSC, DataForSEO, Ahrefs,
Semrush, Google Keyword Planner, Yandex Wordstat). Never present a pattern as a volume.

Universal rules
- **Transcreate, never translate.** Research each language's market separately; the same service
  can have a different main keyword, intent and SERP in each language.
- One primary intent per URL per language; unique title/description/H1 per language.
- hreflang reciprocal + self-referencing + absolute + `x-default`; self-canonical per language.
- No forced IP/Accept-Language redirects on content URLs.
- Slugs: Latin, short, hyphenated. Keep shared slugs across languages unless the site already
  uses localized Latin slugs (de/tr transliterated without diacritics is fine; never raw fa/ru script).

---

## FA — فارسی (RTL)

**Markets:** Iran (Google dominant; many users behind filtering/VPN, so location data is noisy),
Iranian diaspora (Türkiye, UAE, Germany, Canada, USA, UK), Afghanistan (Dari) and Tajikistan
(Tajik is Cyrillic — not covered by `fa`). Decide which market the business serves.

**Orthography — check every string:**
- Persian **ی (U+06CC)** and **ک (U+06A9)**; never Arabic ي (U+064A) / ك (U+0643).
- **ZWNJ (U+200C, نیم‌فاصله)**: «وب‌سایت»، «می‌شود»، «کسب‌وکار»، «خانه‌ها»، «بهترین‌ها».
- Users search **multiple spellings** (وبسایت / وب سایت / وب‌سایت; آپارتمان / اپارتمان;
  ایمپلنت / ایمپلانت). Cover the main variants naturally (title/H1/body/FAQ), never stuffed.
- Digits: one style per page; `tel:` links always Latin digits. Punctuation «،» «؟» «».
- Finglish queries exist; keep visible copy in Persian script.

**Register:** «شما», polite-professional, warm, concise. Avoid literal English idioms.
Trust signals Persian buyers look for: real phone/WhatsApp/Telegram, Persian-speaking support,
clear price or price range, physical address, reviews/testimonials, process.

**Technical:** `lang="fa" dir="rtl"`; hreflang `fa` (or `fa-IR` only when serving Iran
specifically); `og:locale fa_IR`; Arabic-script web font (e.g. Vazirmatn) with `display: swap`;
mirror directional icons; keep numbers/code/Latin brand names LTR with `<bdi>` or `dir="ltr"`.

**Limits:** title ≤ ~55 chars, description ~120–155 chars.

**Commercial/local modifier patterns:** قیمت · هزینه · خرید · فروش · اجاره · بهترین · ارزان ·
نمونه کار · مشاوره رایگان · نزدیک من · در [شهر] · [خدمت] در [کشور] · شرایط · مدارک لازم · نظرات

---

## RU — Русский

**Markets:** Russia, Kazakhstan, Belarus, Ukraine (many prefer `uk`), Russian-speaking
diaspora (Türkiye, UAE, Cyprus, Georgia, Israel, Germany).

**Search engines:** Google **and Yandex** (Yandex leads among users in Russia; Google leads for
Russian speakers abroad). For Yandex:
- **Yandex Webmaster**: add site, sitemap, region; check indexing & quality signals.
- **Yandex Business** (Яндекс Бизнес) listing for local businesses; Yandex Maps reviews.
- **Commercial factors** matter: prices/price ranges, contacts in header, multiple contact
  channels (phone, WhatsApp, Telegram), delivery/terms, guarantees, company details, reviews,
  assortment/services breadth.
- Behavioural factors: fast first screen, clear CTA, low bounce back to SERP.
- Keyword data: **Yandex Wordstat** — ask Sina for exports.
- Yandex supports hreflang; `Clean-param` in robots.txt for tracking params.

**Morphology:** heavy inflection — use natural case forms of the keyword (квартира / квартиры /
квартиру в Анталье) instead of repeating the nominative. Write «ё» correctly.

**Register:** «Вы», businesslike, concrete numbers and terms; Russian readers distrust hype.
Typography: «ёлочки», em dash —, non-breaking spaces before units.

**Technical:** hreflang `ru`, `og:locale ru_RU`, Cyrillic font subset.

**Limits:** text ~15–25 % longer than English; front-load keyword; title ≤ ~60 chars.

**Modifier patterns:** цена · стоимость · купить · заказать · под ключ · недорого · отзывы ·
рейтинг · в [городе] (в Анталье, в Стамбуле) · [услуга] в Турции · с доставкой · рассрочка · условия

---

## DE — Deutsch

**Markets:** Germany, Austria, Switzerland (Swiss: no ß → "ss"), German-speaking diaspora.

**Search engine:** Google (~90 %); Bing relevant for B2B/desktop.

**Language:** compound nouns searched as compound and split (Zahnimplantat / Zahn Implantat;
Ferienwohnung; Immobilienmakler); umlauts in copy (never in slugs: ae/oe/ue/ss);
**„Sie"** for B2B and most services (some lifestyle/D2C brands use „du" — follow the brand);
precise, factual, no hollow superlatives; show process, timeline, price logic, certificates.
Text is ~30 % longer than English — check UI overflow.

**Trust & legal:** **Impressum** (DDG) and **Datenschutzerklärung** (DSGVO) are expected on
business sites targeting Germany; cookie consent (TDDDG) before analytics/ads. Flag as P1 when
missing. (Not legal advice.) Reviews: Google, ProvenExpert, Trustpilot, Jameda (doctors).

**Technical:** hreflang `de` (or `de-DE`/`de-AT`/`de-CH` if content truly differs),
`og:locale de_DE`. Number/date format 1.500,00 € · 25.11.2026. Quotes „…".

**Limits:** title ≤ ~60 chars, keyword first.

**Modifier patterns:** Kosten · Preise · kaufen · mieten · Angebot · Erfahrungen · Test ·
Vergleich · in der Nähe · in [Stadt] · [Leistung] Türkei · Beratung · seriös · auf Deutsch

---

## EN — English

**Markets:** global; decide US vs UK spelling once per site (default US) and stay consistent;
`en` as `x-default` unless the business is local-language-first.

**Rules:** strong E-E-A-T (author/company info, real cases, credentials, reviews); answer-first
paragraphs for AI Overviews/ChatGPT; comparison and "best/cost/how to" content performs well.

**Modifier patterns:** cost · price · for sale · for rent · best · near me · in [city] ·
reviews · vs · how to · requirements · [service] in Turkey · agency · company · services

---

## TR — Türkçe

**Markets:** Türkiye (Google ~90 %+; Yandex small); Turkish diaspora (Germany, NL, Austria).

**Local SEO is critical:** **Google Business Profile** (map pack) with Turkish categories,
photos, Turkish reviews, posts; NAP consistent; local directories (e.g. Yandex Haritalar, sector
portals such as sahibinden/hepsiemlak for real estate, Doktortakvimi for clinics).

**Language:**
- **İ/i vs I/ı** are different letters: `lang="tr"` for correct CSS uppercase; JS
  `toLocaleUpperCase("tr")`.
- Users often type without Turkish characters ("ev fiyatlari antalya"); write correct Turkish
  (ç ğ ı ö ş ü), Google matches.
- Agglutination: use natural suffixed forms (satılık daire → satılık daireler, dairesi).
- Register: **"siz"**, professional and warm.

**Trust & legal:** **KVKK** aydınlatma metni + açık rıza for forms/cookies; Turkish phone format
+90 5xx xxx xx xx; physical address; for e-commerce: Mesafeli Satış Sözleşmesi, İade koşulları.

**Technical:** hreflang `tr`, `og:locale tr_TR`, Latin-ext font.

**Limits:** title ≤ ~60 chars.

**Modifier patterns:** fiyat(ları) · ücret · satılık · kiralık · en iyi · uygun fiyatlı ·
yorumlar · [şehir] [hizmet] (Antalya diş kliniği) · yakınımda · nasıl · ajans · firma · uzmanı

---

## §6b Writing rules (used when copywriting/copy-editing skills are unavailable)

- Outcome → proof → offer → one clear CTA. Specific beats clever (numbers, places, names).
- Short sentences; one idea per paragraph; headings that state what the section proves.
- Remove AI tells in every language: "it's not X, it's Y"; "no X, no Y, no Z"; empty openers
  ("In today's digital world…", «В современном мире…», „In der heutigen digitalen Welt…",
  "Günümüz dijital dünyasında…", «در دنیای امروز…»); stacked adjectives; trailing comma clauses.

## Cross-language QA checklist (run on every deliverable)

- [ ] Keyword researched in this language and market (not translated); intent matches SERP type.
- [ ] Title/description/H1 unique and within limits; primary keyword early; brand at end.
- [ ] Orthography: fa ZWNJ + ی/ک · tr İ/ı · de umlauts & „Sie" · ru «ё», «» · en one spelling system.
- [ ] Register and cultural fit; local currency, units, date/number formats.
- [ ] Preferred contact channel for that market visible (fa/ru/tr → WhatsApp/Telegram; de/en → form/email/phone).
- [ ] Legal/trust pages for that market (KVKK, Impressum/DSGVO, GDPR).
- [ ] No AI tells, no unverifiable claims, internal links stay in the same language.
