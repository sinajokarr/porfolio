import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Inner-page hero: same dark canvas, periwinkle bloom and oversized type as the homepage. */
export default function PageHeader({ eyebrow, title, intro, back, children }) {
  return (
    <header className="relative isolate overflow-hidden bg-ink pb-16 pt-40 md:pb-20 md:pt-48">
      <div aria-hidden="true" className="pointer-events-none absolute -z-10 end-[-10%] top-[-20%] size-[48rem] rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.14),transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="container-x">
        {back && (
          <Link href={back.href} className="mb-10 inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-white" data-hero>
            <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" /> {back.label}
          </Link>
        )}
        {eyebrow && <p className="eyebrow" data-hero>{eyebrow}</p>}
        <h1 className="display mt-5 max-w-5xl text-[clamp(2.4rem,5.6vw,4.8rem)]">
          <span className="block overflow-hidden pb-[0.08em]"><span className="block" data-hero="line">{title}</span></span>
        </h1>
        {intro && <p className="mt-7 max-w-2xl text-[1.08rem] leading-relaxed text-white/70" data-hero>{intro}</p>}
        {children}
      </div>
    </header>
  );
}
