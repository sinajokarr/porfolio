"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

/** Choreographs [data-hero] elements in DOM order. Content is usable throughout (no blocking intro). */
export default function HeroIntro() {
  useGSAP(() => {
    if (!document.documentElement.classList.contains("motion")) return;
    const items = gsap.utils.toArray("[data-hero]");
    items.forEach((el) => (el.style.animation = "none"));
    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.4 }, delay: 0.25 });
    items.forEach((el, i) => {
      const at = i * 0.09;
      if (el.dataset.hero === "line") {
        tl.fromTo(el, { opacity: 0, yPercent: 105, rotate: 2 }, { opacity: 1, yPercent: 0, rotate: 0, duration: 1.6 }, at);
      } else if (el.dataset.hero === "fade") {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 2 }, at + 0.4);
      } else {
        tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, at);
      }
    });
  });
  return null;
}
