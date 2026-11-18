import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/hero/Hero";
import SelectedWork from "@/components/projects/SelectedWork";
import About from "@/components/sections/About";
import ContactSection from "@/components/sections/ContactSection";
import Process from "@/components/sections/Process";
import TechStack from "@/components/sections/TechStack";
import ServicesOverview from "@/components/services/ServicesOverview";
import { getProjects, getServices } from "@/lib/content";

// Who I am → What I offer → What I've built → Capabilities → How I work → About me → Contact.
// Depth (service pages, case studies, the marketing simulator) lives one click away.
export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [services, projects] = await Promise.all([getServices(locale), getProjects(locale)]);
  return (
    <>
      <Hero />
      <ServicesOverview services={services} />
      <SelectedWork projects={projects} />
      <TechStack />
      <Process />
      <About />
      <ContactSection />
    </>
  );
}
