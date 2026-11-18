import { useTranslations } from "next-intl";
import InquiryForm from "@/components/forms/InquiryForm";
import ContactMethods from "./ContactMethods";

/** Closing section: the reference's eclipse-over-dunes scene, direct contact options and the inquiry form. */
export default function ContactSection() {
  const t = useTranslations("contact");
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-ink pb-28 pt-16 md:pb-36 md:pt-24" aria-labelledby="contact-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute end-[4%] top-[2%] size-[30rem] max-w-[80vw] rounded-full shadow-[inset_-10px_6px_30px_-8px_rgb(255_255_255/0.5),0_0_120px_-20px_rgb(201_200_255/0.3)] rtl:shadow-[inset_10px_6px_30px_-8px_rgb(255_255_255/0.5),0_0_120px_-20px_rgb(201_200_255/0.3)]" data-parallax="10" />
        <svg className="absolute inset-x-0 bottom-0 h-[45%] w-full" viewBox="0 0 1440 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cdune1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2c36" /><stop offset="1" stopColor="#08090c" /></linearGradient>
            <linearGradient id="cdune2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4c58" stopOpacity="0.9" /><stop offset="0.5" stopColor="#15161c" /><stop offset="1" stopColor="#08090c" /></linearGradient>
          </defs>
          <path d="M0 260C240 180 420 230 640 200s420-120 800-60v360H0z" fill="url(#cdune1)" opacity="0.7" />
          <path d="M0 360c260-90 520-40 760-90s420-110 680-40v270H0z" fill="url(#cdune2)" />
          <path d="M760 270c180-40 420-110 680-40" stroke="#fff" strokeOpacity="0.35" fill="none" />
        </svg>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#08090c_0%,transparent_30%)]" />
      </div>

      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h2 id="contact-title" className="display text-[clamp(2.1rem,3.4vw,3.1rem)]" data-reveal="mask">
            {t("heading")}
            <br />
            <span className="text-chrome">{t("headingAccent")}</span>
          </h2>
          <p className="mb-10 mt-6 max-w-lg text-lg leading-relaxed text-white/70" data-reveal>{t("desc1")}</p>
          <ContactMethods />
        </div>
        <div data-reveal><InquiryForm /></div>
      </div>
    </section>
  );
}
