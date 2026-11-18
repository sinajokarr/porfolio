import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.js");
const API = process.env.API_INTERNAL_URL || "http://127.0.0.1:8000";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // content/*.json lives at the repo root and is shared with the Django seed command.
  outputFileTracingRoot: path.join(import.meta.dirname, ".."),
  turbopack: {
    root: path.join(import.meta.dirname, ".."),
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
  async rewrites() {
    // Same-origin proxy: the browser never talks to Django directly, so no CORS/CSRF surface.
    return [{ source: "/backend/:path*", destination: `${API}/api/v1/:path*/` }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
