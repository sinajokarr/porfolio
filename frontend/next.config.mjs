import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");
const API = process.env.API_INTERNAL_URL || "http://127.0.0.1:8000";
const STATIC_EXPORT = process.env.SITES_STATIC_EXPORT === "1";
// GitHub Pages serves the site under /<repo>; the workflow sets NEXT_PUBLIC_BASE_PATH=/porfolio.
const BASE_PATH = STATIC_EXPORT ? process.env.NEXT_PUBLIC_BASE_PATH || "" : "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: STATIC_EXPORT ? "export" : "standalone",
  basePath: BASE_PATH,
  trailingSlash: STATIC_EXPORT, // en/index.html — static hosts serve folders reliably
  poweredByHeader: false,
  // content/*.json lives at the repo root and is shared with the Django seed command.
  outputFileTracingRoot: path.join(import.meta.dirname, ".."),
  turbopack: {
    root: path.join(import.meta.dirname, ".."),
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
  async rewrites() {
    // Same-origin proxy: the browser never talks to Django directly, so no CORS/CSRF surface.
    return STATIC_EXPORT ? [] : [{ source: "/backend/:path*", destination: `${API}/api/v1/:path*/` }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
