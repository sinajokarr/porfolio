/**
 * System diagrams drawn from each repository's README / architecture docs (verified Nov 2026).
 * Labels are technical identifiers, so they stay in English and render LTR in every locale.
 */
export const DIAGRAMS = {
  sinshop: {
    layers: [
      { title: "Browser", detail: "en · fa · tr · ru" },
      { title: "Next.js storefront", detail: "App Router · RTL" },
      { title: "Same-origin rewrite", detail: "/backend-api/*" },
      { title: "Django REST Framework", detail: "account · shop · cart · orders · payment", accent: true },
      { title: "Database", detail: "SQLite local · DATABASE_URL" },
    ],
    aside: [
      { title: "Celery + Redis", detail: "abandoned carts · payment notifications" },
      { title: "ZarinPal", detail: "payment request · callback verify" },
    ],
    flow: [
      "POST checkout",
      "BEGIN transaction",
      "SELECT … FOR UPDATE  (cart, items, products)",
      "validate active + stock",
      "create Order + unit-price snapshots",
      "decrement stock · clear cart",
      "COMMIT",
      "payment request → gateway callback → verify",
    ],
    lock: 2,
  },
  nexusticket: {
    layers: [
      { title: "HTTP client", detail: "Swagger UI · ReDoc" },
      { title: "Django REST Framework", detail: "accounts · events · orders · payments", accent: true },
      { title: "Email auth + JWT", detail: "object-level permissions" },
      { title: "Database", detail: "SQLite local · MySQL in Docker" },
    ],
    aside: [
      { title: "Celery worker", detail: "expire_order_task · 15 min" },
      { title: "Redis", detail: "broker · result backend" },
    ],
    flow: [
      "POST /api/orders/",
      "BEGIN transaction",
      "SELECT … FOR UPDATE  (ticket classes, events)",
      "validate status · date · capacity · coupon",
      "create order items · increment sold",
      "COMMIT → schedule expiry (15 min)",
      "still pending? cancel + release inventory",
    ],
    lock: 2,
  },
  "jokar-dental": {
    layers: [
      { title: "Visitor", detail: "fa · en · de · tr" },
      { title: "Next.js App Router", detail: "TypeScript · Tailwind CSS" },
      { title: "Django REST Framework", detail: "consultation requests", accent: true },
      { title: "PostgreSQL", detail: "leads · staff roles" },
    ],
    aside: [{ title: "Staff notifications", detail: "stored first · retried on failure" }],
    flow: ["Consultation form", "validate input", "store request in PostgreSQL", "notify staff", "retry pending notifications"],
    lock: -1,
  },
};
