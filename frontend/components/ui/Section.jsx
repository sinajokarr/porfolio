/** Shared section heading: eyebrow + display title (+ optional intro). */
export function SectionHeading({ eyebrow, title, intro, tone = "dark", as: H = "h2", className = "", titleClassName = "" }) {
  const muted = tone === "light" ? "text-mist-dark" : "text-mist";
  return (
    <div className={className}>
      {eyebrow && (
        <p className={`eyebrow ${tone === "light" ? "!text-mist-dark" : ""}`} data-reveal>
          {eyebrow}
        </p>
      )}
      <H className={`display mt-4 text-[clamp(2rem,4.2vw,3.6rem)] ${titleClassName}`} data-reveal="mask">
        {title}
      </H>
      {intro && (
        <p className={`mt-6 max-w-2xl text-[1.05rem] leading-relaxed ${muted}`} data-reveal>
          {intro}
        </p>
      )}
    </div>
  );
}
