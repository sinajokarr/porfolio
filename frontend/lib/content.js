import "server-only";
import projectsFallback from "../../content/projects.json";
import servicesFallback from "../../content/services.json";

const API = process.env.API_INTERNAL_URL || "http://127.0.0.1:8000";
const REVALIDATE = 300;

const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/** Flatten a content/*.json record into the same shape the Django API returns. */
function localize(item, locale) {
  const t = item.translations[locale] || item.translations.en;
  const { translations, ...rest } = item;
  return {
    ...rest,
    ...t,
    language: item.translations[locale] ? locale : "en",
    description: asList(t.description),
    features: asList(t.features),
    benefits: asList(t.benefits),
    challenges: asList(t.challenges),
    decisions: asList(t.decisions),
    thumbnail: null,
  };
}

const splitParagraphs = (item) => ({
  ...item,
  description: typeof item.description === "string" ? item.description.split("\n").filter(Boolean) : item.description,
});

/** Django is the CMS; the bundled JSON keeps every page renderable when the API is unreachable. */
async function fromApi(path, locale) {
  try {
    const res = await fetch(`${API}/api/v1/${path}?lang=${locale}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(3000),
    });
    if (res.status === 404) return { notFound: true };
    if (!res.ok) return null;
    return { data: await res.json() };
  } catch {
    return null;
  }
}

export async function getServices(locale) {
  const api = await fromApi("services/", locale);
  return api?.data ? api.data.map(splitParagraphs) : servicesFallback.map((s) => localize(s, locale));
}

export async function getService(locale, slug) {
  const api = await fromApi(`services/${slug}/`, locale);
  if (api?.notFound) return null;
  if (api?.data) return splitParagraphs(api.data);
  const item = servicesFallback.find((s) => s.slug === slug);
  return item ? localize(item, locale) : null;
}

export async function getProjects(locale) {
  const api = await fromApi("projects/", locale);
  return api?.data ?? projectsFallback.map((p) => localize(p, locale));
}

export async function getProject(locale, slug) {
  const api = await fromApi(`projects/${slug}/`, locale);
  if (api?.notFound) return null;
  if (api?.data) return api.data;
  const item = projectsFallback.find((p) => p.slug === slug);
  return item ? localize(item, locale) : null;
}

export const serviceSlugs = () => servicesFallback.map((s) => s.slug);
export const projectSlugs = () => projectsFallback.map((p) => p.slug);
