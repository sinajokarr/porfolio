import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/hero/Hero";
import GrowthLab from "@/components/marketing/GrowthLab";
import SelectedWork from "@/components/projects/SelectedWork";
import AboutTeaser from "@/components/sections/AboutTeaser";
import ContactCta from "@/components/sections/ContactCta";
import ServicesOverview from "@/components/services/ServicesOverview";
import { getProjects, getServices } from "@/lib/content";

// Six calm scenes. Depth (service pages, case studies, the inquiry form) lives one click away.
export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [services, projects] = await Promise.all([getServices(locale), getProjects(locale)]);
  return (
    <>
      <Hero />
      <ServicesOverview services={services} />
      <SelectedWork projects={projects} />
      <GrowthLab />
      <AboutTeaser />
      <ContactCta />
    </>
  );
}
