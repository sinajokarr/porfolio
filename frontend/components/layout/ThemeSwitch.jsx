"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useSyncExternalStore } from "react";

/**
 * Day/night on-off switch in the header. The knob slides between moon (dark) and sun (light); the new theme
 * spreads from the knob as a circle (View Transitions; instant where unsupported or with reduced motion).
 * The choice is stored in localStorage and restored before paint by the inline script in the root layout.
 */
const subscribe = (cb) => {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
};
const isLight = () => document.documentElement.classList.contains("light");

export default function ThemeSwitch() {
  const t = useTranslations("nav");
  const on = useSyncExternalStore(subscribe, isLight, () => false);
  const knob = useRef(null);

  const toggle = () => {
    const root = document.documentElement;
    const next = !isLight();
    const apply = () => {
      root.classList.toggle("light", next);
      try {
        localStorage.setItem("theme", next ? "light" : "dark");
      } catch {}
      window.dispatchEvent(new Event("themechange"));
    };
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const b = knob.current.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    );
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      aria-label={on ? t("themeToDark") : t("themeToLight")}
      title={on ? t("themeToDark") : t("themeToLight")}
      className="relative h-8 w-[3.75rem] shrink-0 rounded-full border border-white/15 bg-white/[0.06] transition-colors duration-300 hover:border-white/30"
      dir="ltr"
    >
      {/* Track icons: the one the knob is not covering hints at the other mode. */}
      <Moon className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-white/40" aria-hidden="true" />
      <Sun className="absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-white/40" aria-hidden="true" />
      <span
        ref={knob}
        className={`absolute left-[3px] top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_4px_12px_-2px_rgb(0_0_0/0.35)] transition-transform duration-500 ease-[var(--ease-out-expo)] ${on ? "translate-x-7" : "translate-x-0"}`}
        aria-hidden="true"
      >
        {on ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      </span>
    </button>
  );
}
