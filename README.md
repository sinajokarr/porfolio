# Sina Jokar — Portfolio & Client Acquisition Website

Multilingual (EN / TR / FA-RTL / RU) portfolio and inquiry platform.

| Part | Stack |
| --- | --- |
| `frontend/` | Next.js 16 (App Router, JavaScript), Tailwind CSS 4, next-intl, GSAP + ScrollTrigger, React Hook Form + Zod. Hero = 2.5D layered portrait (CSS/SVG, no WebGL) |
| `backend/` | Python 3.13, Django 6.1, Django REST Framework, PostgreSQL, drf-spectacular, WhiteNoise, Gunicorn |
| `content/` | `services.json`, `projects.json` — seed data for Django **and** the frontend's offline fallback |

## How it fits together

```
Browser ─► Next.js (SSG pages, /en /tr /fa)
              │  /backend/*  (same-origin rewrite, no CORS)
              ▼
           Django REST API  /api/v1/* ─► PostgreSQL
              │
              └─ email notification for each inquiry (stored first, so a mail failure never loses a lead)
```

* The homepage follows the visitor journey: Hero → Services → Selected Work → Capabilities & Technologies → Process → About → Contact (with the inquiry form). The Google Ads simulator (Growth Lab) lives on `/services/performance-marketing`.
* Pages are statically generated and revalidate content from the API every 5 minutes. If the API is unreachable, they render from `content/*.json`.
* Django Admin is the CMS: services, projects (status, featured, GitHub/live links, thumbnails, translations) and inquiries.

## Local development

Prerequisites: Python 3.13, Node 24+, Docker (for PostgreSQL).

```bash
cp .env.example .env
# for local dev set in .env:
#   DJANGO_DEBUG=true
#   DATABASE_URL=postgres://sinajokar:devpassword@127.0.0.1:5434/sinajokar
docker run -d --name sj-postgres -e POSTGRES_DB=sinajokar -e POSTGRES_USER=sinajokar \
  -e POSTGRES_PASSWORD=devpassword -p 127.0.0.1:5434:5432 postgres:18-alpine
```

Backend:

```bash
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements/dev.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py createcachetable
.venv/bin/python manage.py seed_content        # loads content/*.json (safe to re-run)
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver 127.0.0.1:8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000 → redirects to /en, /tr or /fa
```

## Useful URLs

| URL | What |
| --- | --- |
| `/en`, `/tr`, `/fa` | Website |
| `http://127.0.0.1:8000/admin/` | Django Admin (path set by `DJANGO_ADMIN_URL`) |
| `/api/v1/docs/` · `/api/v1/redoc/` · `/api/v1/schema/` | OpenAPI documentation |
| `/api/v1/health/` | Health check (DB included) |

API: `GET services/`, `services/{slug}/`, `projects/`, `projects/{slug}/` (`?lang=en|tr|fa`, filters `category`, `kind`, `status`, `featured`), `GET site-settings/`, `POST inquiries/` (throttled, honeypot-protected, create-only).

## Managing content (no code changes needed)

Django Admin →
* **Projects**: add/edit, change status (Live, Development Project, Concept, In Progress, Case Study), toggle *featured* / *published*, upload a thumbnail (replaces the built-in illustration), edit the EN/TR/FA case study inline. List fields (features, challenges, decisions) take one item per line.
* **Services**: same pattern with per-language title, tagline, description, features and benefits.
* **Inquiries**: filter by service/status, search, change status inline (New → Contacted → Qualified → Proposal Sent → Closed), add internal notes, bulk "mark as contacted". Each inquiry records whether its notification email was handed to the mail server.

Changes appear on the site within 5 minutes (ISR revalidation).
Editing `content/*.json` + `seed_content` is the alternative for bulk edits; it overwrites translations for the slugs it contains.

## Tests

```bash
cd backend && .venv/bin/python -m pytest          # API, validation, throttling, email failure, admin auth, field privacy
cd frontend && npm test                           # funnel math, form schema, translation-key parity, content honesty
cd frontend && npm run build && npm start &       # then:
cd frontend && npx playwright install chromium && npm run test:e2e   # routes, RTL, language switch, form → Django
npm run lint
```

## Production deployment

1. Copy `.env.example` → `.env` and set `DJANGO_SECRET_KEY`, `POSTGRES_PASSWORD`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, `NEXT_PUBLIC_SITE_URL`, SMTP settings, and a non-obvious `DJANGO_ADMIN_URL`.
2. `docker compose up -d --build` — starts PostgreSQL, Django (migrate + seed + Gunicorn) and Next.js (standalone).
3. Put an HTTPS reverse proxy (Caddy / nginx / Traefik) in front: the domain → `frontend:3000`; the admin path → `backend:8000` (or keep admin reachable only via VPN/SSH tunnel). With an extra proxy, set `API_NUM_PROXIES=2` so rate limiting sees real client IPs.
4. `docker compose exec backend python manage.py createsuperuser`

**Media**: uploaded thumbnails live in the `media` volume. Serve `/media/` from the reverse proxy, or move to S3-compatible storage via `STORAGES["default"]` if needed.
**Backups**: `docker compose exec db pg_dump -U sinajokar sinajokar > backup.sql` on a schedule, plus the `media` volume.
**Data retention**: `python manage.py purge_inquiries --days 730` from cron (matches the privacy policy).
**Email**: with Yahoo, create an app password. Delivery is attempted once per inquiry with a 10 s timeout; failures are visible in Admin (`email_status`).
**Analytics**: set `NEXT_PUBLIC_GTM_ID` to enable GTM. It loads only after the visitor accepts the consent banner. Events: `contact_form_submit`, `contact_whatsapp_click`, `contact_email_click`, `contact_phone_click`, `service_inquiry_click`, `project_view`, `github_project_click`, `linkedin_profile_click`. No form contents are sent.

## Content authenticity notes

* Project facts come from the public repositories and jokarco.com (checked Nov 2026). `django-realestate-platform` currently contains only a README, so it is labelled **Concept** and not featured.
* No testimonials, client counts, years of experience or campaign results are shown. The Growth Lab is labelled as illustrative estimates.
* The portrait is the owner-supplied photo, graded monochrome (`frontend/public/sina-jokar.webp`).
# porfolio

## Hero portrait

`frontend/public/hero-portrait.webp` is the owner's photo with the background removed (Apple Vision, on-device) and a monochrome studio grade — lighting and colour only, the face is not altered. To regenerate it from a new or higher-resolution photo (recommended: ≥ 1600 px tall):

```bash
python3 -m venv /tmp/imgenv && /tmp/imgenv/bin/pip install pyobjc-framework-Vision pyobjc-framework-Quartz pillow numpy
/tmp/imgenv/bin/python frontend/scripts/portrait/cutout.py photo.jpg /tmp/mask.png
/tmp/imgenv/bin/python frontend/scripts/portrait/grade.py photo.jpg /tmp/mask.png frontend/public/hero-portrait.webp --og frontend/public/og-portrait.png
```

## iCloud Drive warning (this Mac)

The project lives on the Desktop, which is synced by iCloud with "Optimize Mac Storage". When the disk is low, macOS evicts files and builds hang while it re-downloads them. `frontend/node_modules` and `backend/.venv` are therefore symlinks to `node_modules.nosync` / `.venv.nosync` (iCloud skips `*.nosync`). After `npm install`, re-create the link:

```bash
cd frontend && rm -rf node_modules.nosync && mv node_modules node_modules.nosync && ln -s node_modules.nosync node_modules
```

Moving the project out of the Desktop (e.g. `~/Projects`) removes the problem entirely.
