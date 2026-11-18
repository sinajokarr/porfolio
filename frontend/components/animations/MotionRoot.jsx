"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * One scroll-reveal system for the whole site:
 *   [data-reveal]        fade + rise
 *   [data-reveal="mask"] heading wipes up from a clip mask
 *   [data-reveal="scale"] media settles from a slight zoom
 *   [data-parallax="n"]  gentle scroll parallax (n = strength)
 * Skipped entirely under reduced motion (html.motion is never set, so nothing is hidden).
 */
export default function MotionRoot() {
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const els = gsap.utils.toArray("[data-reveal]:not([data-hero])");
      els.forEach((el) => {
        el.style.animation = "none"; // GSAP owns it now; cancel the CSS failsafe
        gsap.set(el, { opacity: 0 });
      });

      ScrollTrigger.batch(els, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          batch.forEach((el, i) => {
            const kind = el.dataset.reveal;
            const base = { opacity: 1, duration: 1.1, delay: i * 0.08, ease: "expo.out", clearProps: "transform,clipPath" };
            if (kind === "mask") {
              gsap.fromTo(el, { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }, { ...base, y: 0, clipPath: "inset(0 0 -20% 0)", duration: 1.3 });
            } else if (kind === "scale") {
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

      // Fonts and images can shift layout after first paint.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
