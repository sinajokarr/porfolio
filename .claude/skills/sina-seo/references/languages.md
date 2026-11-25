# Per-language SEO rules — fa · ru · de · en · tr

Keyword seeds below are **starting points to validate** with real data (Search Console, Ahrefs,
Semrush, Google Keyword Planner, Yandex Wordstat). They are not volumes and not guarantees.
Slugs stay in English/Latin across all locales (this repo shares slugs between locales).

---

## FA — فارسی (RTL)

**Audience:** Iranian entrepreneurs and businesses in Türkiye (Antalya, Istanbul), Iranians abroad,
Iranian businesses needing an international site or Google Ads.

**Orthography — check every Persian string:**
- Use Persian letters **ی (U+06CC)** and **ک (U+06A9)**, never Arabic ي (U+064A) / ك (U+0643).
  Fix with a find/replace pass on `messages/fa.json`.
- **Half-space / ZWNJ (U+200C, نیم‌فاصله)** in compounds and suffixes: «وب‌سایت»، «می‌سازم»،
  «طراحی‌شده»، «کسب‌وکار»، «نرم‌افزار»، «سئو‌ی» → prefer «سئوی». Never a normal space inside
  «می‌», «ها», «تر/ترین» joins.
- Users search **several spellings** of the same thing. Cover them naturally across title / H1 /
  body / FAQ, never stuffed: «وب‌سایت / وبسایت / وب سایت»، «طراحی سایت / سایت سازی / ساخت سایت»،
  «سئو / بهینه سازی سایت»، «گوگل ادز / تبلیغات گوگل / ادوردز».
- Digits: in body copy Persian digits (۱۲۳) read naturally; in prices/phones keep one style
  consistently. Phone numbers inside `tel:` links always Latin digits.
- Punctuation: Persian comma «،», question mark «؟», guillemets «» for quotes.
- Some users type **Finglish** (tarahi site, sakht site). Don't put Finglish in visible copy; it can
  appear in a FAQ question if it reads naturally, otherwise leave it to Google's matching.

**Register:** polite-professional, «شما» form, warm but not flowery. Avoid literal translations of
English marketing idioms. Short sentences — Persian RTL long paragraphs read heavily on mobile.

**Technical:** `<html lang="fa" dir="rtl">`, hreflang `fa` (not `fa-IR` — audience is global
diaspora), `og:locale` `fa_IR`. Arabic-script font (e.g. Vazirmatn) with `display: swap`;
Geist has no Arabic subset, so Persian currently falls back to a system font — check rendering
and CLS. Mirror icons/arrows for RTL; numbers and code stay LTR (`<bdi>` / `dir="ltr"` spans).

**Title length:** ≤ ~55 characters (Persian glyphs are wide in SERPs). Brand at end: «— سینا جوکار».

**Keyword seeds:**
- طراحی سایت در آنتالیا · طراحی سایت در ترکیه · برنامه نویس ایرانی در ترکیه
- طراحی سایت شرکتی · طراحی سایت فروشگاهی · قیمت طراحی سایت · هزینه ساخت سایت
- برنامه نویس فول استک · برنامه نویس پایتون جنگو · توسعه نرم افزار اختصاصی
- متخصص گوگل ادز · تبلیغات در گوگل · راه اندازی کمپین گوگل ادز · نصب گوگل تگ منیجر · ردیابی تبدیل
- سئو سایت · سئو تکنیکال · افزایش سرعت سایت
- Intent modifiers: قیمت، هزینه، بهترین، نمونه کار، مشاوره رایگان، فریلنسر

---

## RU — Русский

**Audience:** Russian-speaking business owners and expats in Antalya/Alanya (real estate, tourism,
clinics, services), plus remote clients in RU/KZ/BY/UA/CIS.

**Search engines:** optimize for **Google and Yandex**. Users physically in Türkiye mostly use
Google; users in Russia mostly Yandex.
- Register in **Yandex Webmaster** (Яндекс Вебмастер) and add the sitemap; set the region to Türkiye/
  Antalya where relevant. Yandex supports hreflang.
- **Yandex Business (Яндекс Бизнес)** listing for local visibility.
- Yandex weighs **commercial factors**: visible contacts, phone/WhatsApp/Telegram, prices or price
  ranges, process, guarantees, real cases, company/person details. Make these explicit on service pages.
- Yandex weighs behavioural factors: fast first screen, clear CTA, low pogo-sticking.
- Keyword data: **Yandex Wordstat** (wordstat.yandex.ru) — ask Sina for exports.

**Morphology:** Russian inflects heavily. Use the main keyword in its natural forms (разработка
сайтов / разработку сайта / сайтов в Анталье) rather than repeating the exact nominative phrase.
Both «ё» and «е» are matched; write «ё» correctly in copy.

**Register:** «Вы» (capitalised in direct address is fine for B2B), concrete and businesslike;
Russian readers distrust hype — show numbers, terms, process. Quotes «ёлочки», em dash —.

**Technical:** hreflang `ru`, `og:locale` `ru_RU`, Cyrillic font subset (Geist already loads
`cyrillic`). Transliterated slugs not needed — keep shared English slugs.

**Title:** Russian strings are ~15–25% longer than English; front-load the keyword, ≤ ~60 chars.
Brand: «— Сина Джокар».

**Keyword seeds:**
- разработка сайтов Анталья · создание сайта в Турции · заказать сайт Анталья · веб-разработчик Анталья
- сайт для агентства недвижимости Турция · сайт для бизнеса в Турции · лендинг под ключ
- настройка Google Ads · контекстная реклама Google в Турции · специалист по Google Ads
- настройка GA4 и GTM · отслеживание конверсий · SEO продвижение сайта в Турции
- фрилансер разработчик Python Django · разработка интернет-магазина
- Intent modifiers: цена, стоимость, под ключ, недорого, отзывы, портфолио, срок

---

## DE — Deutsch (not live yet — see implementation §3 to add `de`)

**Audience:** German/Austrian/Swiss SMBs, agencies needing a dev partner, and the large German
community and German-owned businesses on the Turkish Riviera.

**Search engine:** Google (~90 %+). Bing small but non-zero for B2B.

**Language:**
- **Compound nouns**: users search both compound and split forms — Webentwicklung / Web
  Entwicklung, Webdesign / Web Design, Website erstellen lassen, Webentwickler, Landingpage.
- **Umlauts** ä ö ü ß in copy always; never in URLs (shared English slugs anyway).
- **Register: „Sie"** for B2B. Precise, factual, no exaggerated superlatives; Germans expect
  clear scope, process, timeline and price logic.
- German text runs **~30 % longer** than English: check buttons, nav, cards and titles for overflow.
- Quotes „…", decimal comma (1.500,00 €), dates 25.11.2026.

**Trust & legal (ranking-adjacent, conversion-critical):**
- **Impressum** page (legal notice required by the DDG for business sites targeting Germany) and a
  **Datenschutzerklärung** (DSGVO). Cookie consent per TDDDG before analytics/ads tags fire.
  Flag these as P1 before launching `de`. (Not legal advice — Sina should confirm.)

**Technical:** hreflang `de` (generic, covers DE/AT/CH), `og:locale` `de_DE`, Latin-ext font
(already loaded).

**Title:** ≤ ~60 chars, keyword first. Brand: „– Sina Jokar".

**Keyword seeds:**
- Webentwickler Antalya · Webdesign Türkei · Website erstellen lassen · Webentwicklung Freelancer
- Full-Stack-Entwickler Python Django · Next.js Entwickler · individuelle Webanwendung
- Google Ads Betreuung · Google Ads Freelancer · Conversion Tracking einrichten · GA4 einrichten · GTM
- Landingpage erstellen lassen · Onlineshop erstellen lassen · technische SEO
- Intent modifiers: Kosten, Preis, Angebot, Agentur vs. Freelancer, Erfahrung, Referenzen

---

## EN — English (`x-default`)

**Audience:** international clients, startups, agencies outsourcing dev, English-speaking expats
in Türkiye.

**Rules:** British vs American spelling — pick **one** (US recommended: optimize, color) and stay
consistent. E-E-A-T: show real projects, stack, GitHub, LinkedIn, process. Answer-first copy for
AI search. Brand: "— Sina Jokar".

**Keyword seeds:**
- full-stack developer Antalya · web developer Turkey · freelance Django developer · Next.js developer for hire
- Google Ads specialist / freelancer · conversion tracking setup · GA4 GTM setup · landing page developer
- custom web application development · technical SEO and site speed
- hire remote full-stack developer · website for real estate agency Turkey
- Intent modifiers: cost, pricing, hire, freelance vs agency, portfolio, case study

---

## TR — Türkçe

**Audience:** Turkish SMBs, especially Antalya and the Mediterranean region (tourism, hotels,
real estate, clinics, restaurants, e-commerce).

**Search engine:** Google (~90 %+). **Google Business Profile in Antalya is essential** for
"Antalya web tasarım"-type local queries (map pack). Collect real reviews in Turkish.

**Language:**
- Dotted/dotless i: **İ/i** and **I/ı** are different letters. Uppercasing must be locale-aware:
  `lang="tr"` on `<html>` so CSS `text-transform: uppercase` gives "İ"; in JS use
  `toLocaleUpperCase("tr")`. Wrong casing ("ANTALYA WEB TASARIM" vs "İ") looks unprofessional.
- Many users type **without Turkish characters** ("web tasarim antalya", "eticaret sitesi").
  Always write correct Turkish in copy (ç ğ ı ö ş ü); Google matches the ASCII variants.
- Agglutination: keywords appear with suffixes (web sitesi → web sitesini, sitesi yapımı). Use
  natural suffixed forms.
- Register: **"siz"**, professional and warm. Short, clear sentences.
- Common term pairs: web tasarım / web sitesi yapımı / site kurma; e-ticaret sitesi; kurumsal web sitesi.

**Trust & legal:** **KVKK** aydınlatma metni (privacy notice) for the inquiry form; Turkish phone
format +90 5xx xxx xx xx; mention being based in Antalya (local trust).

**Technical:** hreflang `tr`, `og:locale` `tr_TR`, Latin-ext font (loaded).

**Title:** ≤ ~60 chars. Brand: "— Sina Jokar".

**Keyword seeds:**
- Antalya web tasarım · Antalya web sitesi yapımı · Antalya yazılım · freelance web tasarımcı Antalya
- kurumsal web sitesi · e-ticaret sitesi yapımı · otel web sitesi · emlak web sitesi
- Google Ads uzmanı Antalya · Google reklam yönetimi · dönüşüm takibi kurulumu · GA4 GTM kurulumu
- özel yazılım geliştirme · Python Django geliştirici · Next.js · SEO hizmeti Antalya · site hızlandırma
- Intent modifiers: fiyat, fiyatları, ücret, ajans, uzman, referans, en iyi

---

## Cross-language QA (run before delivering any copy)

- [ ] Keyword researched in this language (not translated); intent matches the page.
- [ ] Title/description/H1 unique for this locale and within length.
- [ ] Orthography rules above passed (ZWNJ & ی/ک for fa, İ/ı for tr, umlauts for de, ё/«» for ru).
- [ ] Register correct (شما / Вы / Sie / siz / you).
- [ ] Local proof: city, currency, legal page, contact channel that locale prefers
      (fa/tr/ru → WhatsApp/Telegram prominent; de/en → email & form).
- [ ] No AI tells, no unverifiable claims.
- [ ] Internal links stay in the same locale.
