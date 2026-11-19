"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * One scroll-reveal system for the whole site:
 *   [data-reveal]        fade + rise
 *   [data-reveal="mask"] heading: each line rises out of its own mask, staggered (SplitText, re-splits on resize)
 *   [data-reveal="scale"] media settles from a slight zoom
 *   [data-parallax="n"]  gentle scroll parallax (n = strength)
 *   [data-process]       the process line draws across the steps as you scroll; each [data-step] lights up when reached
 * Skipped entirely under reduced motion (html.motion is never set, so nothing is hidden).
 */
export default function MotionRoot() {
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const all = gsap.utils.toArray("[data-reveal]:not([data-hero])");
      all.forEach((el) => (el.style.animation = "none")); // GSAP owns them now; cancel the CSS failsafe

      // Headings: editorial line reveal. Lines are re-measured on resize (autoSplit), the tween is rebuilt each time.
      const headings = all.filter((el) => el.dataset.reveal === "mask");
      headings.forEach((el) => {
        gsap.set(el, { opacity: 1 });
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 112,
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }),
        });
      });

      const els = all.filter((el) => el.dataset.reveal !== "mask");
      gsap.set(els, { opacity: 0 });

      ScrollTrigger.batch(els, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          batch.forEach((el, i) => {
            const kind = el.dataset.reveal;
            const base = { opacity: 1, duration: 1.1, delay: i * 0.08, ease: "expo.out", clearProps: "transform,clipPath" };
            if (kind === "scale") {
              gsap.fromTo(el, { opacity: 0, scale: 1.06 }, { ...base, scale: 1, duration: 1.6 });
            } else {
              gsap.fromTo(el, { opacity: 0, y: 28 }, { ...base, y: 0 });
            }
          }),
      });

      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -Number(el.dataset.parallax || 8),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });

      // Process: one line draws across the steps with the scroll; each step's marker fills as the line reaches it.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = document.querySelector("[data-process]");
        if (!track) return;
        const line = track.querySelector("[data-process-line]");
        const marks = gsap.utils.toArray("[data-step]", track);
        const rtl = document.documentElement.dir === "rtl";
        const tl = gsap.timeline({ scrollTrigger: { trigger: track, start: "top 78%", end: "bottom 62%", scrub: 0.8 } });
        tl.fromTo(line, { scaleX: 0, transformOrigin: rtl ? "100% 50%" : "0% 50%" }, { scaleX: 1, ease: "none", duration: 1 }, 0);
        marks.forEach((m, i) =>
          tl.fromTo(m, { backgroundColor: "#ffffff", color: "#0b0d12" }, { backgroundColor: "#0b0d12", color: "#ffffff", duration: 0.08 }, (i / Math.max(1, marks.length - 1)) * 0.92),
        );
      });

      // Fonts and images can shift layout after first paint.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
