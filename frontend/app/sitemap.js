import projects from "../../content/projects.json";
import services from "../../content/services.json";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const LOCALES = ["en", "tr", "fa", "ru"];

export default function sitemap() {
  const paths = ["", "/services", "/projects", "/about", "/contact", "/privacy",
    ...services.map((s) => `/services/${s.slug}`), ...projects.map((p) => `/projects/${p.slug}`)];
  return paths.flatMap((path) =>
    LOCALES.map((l) => ({
      url: `${SITE_URL}/${l}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE_URL}/${x}${path}`])) },
    })),
  );
}
