"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "From code to growth" — the closing scene's signature motion, drawn on a dot grid inside the eclipse.
 * The grid ripples out from the centre, a `</>` lights up (the build), then every lit dot flies onto a
 * rising line that draws itself (the growth). Loops while on screen; the markup itself is the final
 * frame, so reduced motion and no-JS get a complete still.
 */
const N = 15; // grid is N × N
const GAP = 18;
const PAD = 24;
const at = (c) => PAD + c * GAP;
const C = (N - 1) / 2;

const GRID = [];
for (let r = 0; r < N; r++)
  for (let c = 0; c < N; c++) {
    const d = Math.hypot(c - C, r - C);
    if (d <= 7.6) GRID.push({ c, r, d });
  }

// `</>` in grid cells.
const GLYPH = [
  [4, 4], [3, 5], [2, 6], [1, 7], [2, 8], [3, 9], [4, 10],
  [9, 3], [9, 4], [8, 5], [8, 6], [7, 7], [6, 8], [6, 9], [5, 10], [5, 11],
  [10, 4], [11, 5], [12, 6], [13, 7], [12, 8], [11, 9], [10, 10],
].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

// A believable growth line: slow start, one dip, then a climb.
const CURVE = Array.from({ length: 13 }, (_, i) => {
  const c = i + 1;
  let r = Math.round(11 - 8 * Math.pow(i / 12, 1.7));
  if (c === 6) r += 1;
  return [c, r];
});
const TARGET = GLYPH.map((_, i) => CURVE[Math.floor((i * CURVE.length) / GLYPH.length)]);

// Catmull-Rom through the curve points → smooth cubic path.
const pts = CURVE.map(([c, r]) => [at(c), at(r)]);
const LINE = pts.reduce((d, p, i) => {
  if (i === 0) return `M${p[0]} ${p[1]}`;
  const p0 = pts[i - 2] || pts[i - 1], p1 = pts[i - 1], p3 = pts[i + 1] || p;
  const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6];
  const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6];
  return `${d} C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p[0]} ${p[1]}`;
}, "");
const AREA = `${LINE} L${at(13)} ${at(13)} L${at(1)} ${at(13)} Z`;
const TIP = pts[pts.length - 1];

export default function BuildGrowMotif({ className = "" }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!document.documentElement.classList.contains("motion")) return;
      const q = gsap.utils.selector(root);
      const dots = q(".bg-dot");
      const parts = q(".bg-part");
      const line = q(".bg-line");
      const fade = q(".bg-area, .bg-tip");

      // Start state: empty grid, glyph dots hidden at their `</>` cells, line undrawn.
      gsap.set(dots, { attr: { r: 0 }, opacity: 0 });
      const toGlyph = () =>
        parts.forEach((p, i) => gsap.set(p, { attr: { cx: at(GLYPH[i][0]), cy: at(GLYPH[i][1]), r: 0, fill: "#ffffff" }, opacity: 0 }));
      toGlyph();
      gsap.set(line, { strokeDashoffset: 1 });
      gsap.set(fade, { opacity: 0 });

      const intro = gsap.timeline().to(dots, {
        attr: { r: 1.4 },
        opacity: 0.22,
        duration: 0.9,
        ease: "back.out(3)",
        stagger: (i) => GRID[i].d * 0.045,
      });

      const loop = gsap
        .timeline({ repeat: -1, repeatDelay: 0.4, onRepeat: toGlyph })
        // Build: the `</>` lights up, left to right.
        .to(parts, { attr: { r: 2.7 }, opacity: 1, duration: 0.5, ease: "back.out(2.4)", stagger: 0.03 })
        .to({}, { duration: 1.3 })
        // Grow: every dot flies onto the line, turning lavender on the way.
        .to(parts, {
          attr: { cx: (i) => at(TARGET[i][0]), cy: (i) => at(TARGET[i][1]), fill: "#c9c8ff" },
          duration: 1.3,
          ease: "expo.inOut",
          stagger: { each: 0.018, from: "random" },
        })
        .to(line, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, "-=0.6")
        // A light wave sweeps the grid in step with the line.
        .to(dots, { opacity: 0.6, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut", stagger: (i) => GRID[i].c * 0.08 }, "<")
        .to(fade, { opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.7")
        .to({}, { duration: 2.4 })
        // Out: dots shrink away from the tip, the line runs off forward.
        .to(parts, { attr: { r: 0 }, opacity: 0, duration: 0.5, ease: "power2.in", stagger: { each: 0.02, from: "end" } })
        .to(line, { strokeDashoffset: -1, duration: 0.8, ease: "power2.in" }, "<")
        .to(fade, { opacity: 0, duration: 0.6 }, "<");

      const master = gsap.timeline({ paused: true }).add(intro).add(loop, "-=0.3");
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 85%",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? master.play() : master.pause()),
      });
    },
    { scope: root },
  );

  return (
    <svg ref={root} viewBox="0 0 300 300" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bg-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#aaa9f5" stopOpacity="0.28" />
          <stop offset="1" stopColor="#aaa9f5" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bg-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#c9c8ff" />
        </linearGradient>
        <filter id="bg-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {GRID.map(({ c, r }) => (
        <circle key={`${c}-${r}`} className="bg-dot" cx={at(c)} cy={at(r)} r="1.4" fill="#ffffff" opacity="0.22" />
      ))}
      <path className="bg-area" d={AREA} fill="url(#bg-area)" />
      <path className="bg-line" d={LINE} pathLength="1" strokeDasharray="1 1" fill="none" stroke="url(#bg-stroke)" strokeWidth="1.6" strokeLinecap="round" />
      <g filter="url(#bg-glow)">
        {TARGET.map(([c, r], i) => (
          <circle key={i} className="bg-part" cx={at(c)} cy={at(r)} r="2.7" fill="#c9c8ff" />
        ))}
      </g>
      <g className="bg-tip">
        <circle cx={TIP[0]} cy={TIP[1]} r="9" fill="none" stroke="#c9c8ff" strokeOpacity="0.5" />
        <circle cx={TIP[0]} cy={TIP[1]} r="4" fill="#ffffff" filter="url(#bg-glow)" />
      </g>
    </svg>
  );
}
