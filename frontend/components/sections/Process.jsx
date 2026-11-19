import { useTranslations } from "next-intl";

export default function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps");
  return (
    <section id="process" className="relative overflow-hidden bg-ice py-24 text-text-dark md:py-32" aria-labelledby="process-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_0%,#fff,transparent_70%)]" />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <p className="eyebrow !text-mist-dark" data-reveal>{t("eyebrow")}</p>
          <h2 id="process-title" className="display mt-4 text-[clamp(2rem,3.6vw,3.2rem)]" data-reveal="mask">{t("heading")}</h2>
        </div>
        <ol className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8" data-process>
          <span aria-hidden="true" className="absolute inset-x-0 top-[1.15rem] hidden h-px bg-gradient-to-r from-text-dark/0 via-text-dark/15 to-text-dark/0 lg:block" />
          <span aria-hidden="true" className="absolute inset-x-[1.1rem] top-[1.1rem] hidden h-[2px] rounded-full bg-gradient-to-r from-accent-strong to-text-dark rtl:bg-gradient-to-l lg:block" data-process-line />
          {steps.map((s, i) => (
            <li key={s.title} className="relative" data-reveal>
              <span className="relative grid size-9 place-items-center rounded-full bg-white font-mono text-xs shadow-[0_8px_24px_-10px_rgb(20_22_40/0.4)] ring-1 ring-line-dark" dir="ltr" data-step>
                0{i + 1}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-mist-dark">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
