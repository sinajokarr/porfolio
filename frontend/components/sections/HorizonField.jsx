"use client";

import { useEffect, useRef } from "react";

/**
 * "Horizon": a slow, breathing landscape of points seen through the contact section's eclipse.
 * A lavender light band drifts across it and the surface rises gently toward the pointer.
 * Canvas 2D, ~1,300 points in perspective; DPR capped, paused off-screen, one still frame under reduced motion.
 */
const COLS = 64;
const ROWS = 28;
const NEAR = 0.55;
const FAR = 5.2;
const CAM_Y = 0.62;

function height(x, z, t, px, pz, lift) {
  let y = 0.16 * Math.sin(x * 1.9 + t * 0.45 + z * 1.15) * Math.cos(z * 1.6 - t * 0.32);
  y += 0.07 * Math.sin(x * 4.1 - t * 0.7 + z * 0.6);
  y += 0.05 * Math.cos(z * 3.3 + t * 0.5);
  const d2 = (x - px) ** 2 + ((z - pz) * 0.7) ** 2;
  return y + lift * 0.22 * Math.exp(-d2 * 2.4);
}

export default function HorizonField({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const still = !document.documentElement.classList.contains("motion");
    let w = 0, h = 0, raf = 0, visible = false;
    const pointer = { x: 0, z: 2.2, lift: 0, tx: 0, tz: 2.2, tlift: 0 };

    // ponytail: DPR capped at 1.5 — points are tiny and soft; raise only if they look blurry on 4K.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.z += (pointer.tz - pointer.z) * 0.06;
      pointer.lift += (pointer.tlift - pointer.lift) * 0.05;
      ctx.clearRect(0, 0, w, h);
      const f = w * 0.62; // focal length
      const cx = w / 2;
      const horizon = h * 0.42;
      const band = Math.sin(t * 0.16) * 1.3; // the drifting light band, in world x
      const light = document.documentElement.classList.contains("light");
      const base = light ? [26, 28, 40] : [255, 255, 255]; // ink points by day, white by night
      const tint = light ? [91, 95, 230] : [170, 169, 245];

      // Faint glow on the horizon line.
      const g = ctx.createLinearGradient(0, horizon - h * 0.12, 0, horizon + h * 0.08);
      g.addColorStop(0, "rgba(170,169,245,0)");
      g.addColorStop(0.7, light ? "rgba(91,95,230,0.08)" : "rgba(170,169,245,0.10)");
      g.addColorStop(1, "rgba(170,169,245,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, horizon - h * 0.12, w, h * 0.2);

      for (let r = ROWS - 1; r >= 0; r--) {
        const z = NEAR + (FAR - NEAR) * (r / (ROWS - 1)) ** 1.5; // denser rows toward the horizon
        const fade = Math.min(1, (FAR - z) / 1.4) * Math.min(1, (z - NEAR) / 0.35 + 0.25);
        for (let c = 0; c < COLS; c++) {
          const x = (c / (COLS - 1) - 0.5) * 2 * (0.9 + z * 0.62);
          const y = height(x, z, t, pointer.x, pointer.z, pointer.lift);
          const sx = cx + (x / z) * f;
          const sy = horizon + ((CAM_Y - y) / z) * f;
          if (sx < -4 || sx > w + 4 || sy > h + 4) continue;
          const glow = Math.exp(-((x - band) ** 2) * 1.6);
          const lit = Math.max(0, y + 0.12) * 1.8; // crests catch more light
          const a = fade * (0.2 + 0.42 * lit + 0.6 * glow);
          if (a < 0.02) continue;
          const s = Math.max(0.6, 2.3 / z);
          // Points take the accent colour inside the light band.
          const mix = (i) => Math.round(base[i] + (tint[i] - base[i]) * glow);
          ctx.fillStyle = `rgba(${mix(0)},${mix(1)},${mix(2)},${a.toFixed(3)})`;
          ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
        }
      }
    };

    const start = performance.now();
    const loop = (now) => {
      draw((now - start) / 1000);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const move = (e) => {
      const b = canvas.getBoundingClientRect();
      const nx = (e.clientX - b.left) / b.width - 0.5;
      const ny = (e.clientY - b.top) / b.height;
      pointer.tx = nx * 3;
      pointer.tz = 1 + Math.max(0, 1 - ny) * 2.5;
      pointer.tlift = ny > 0.3 && ny < 1 && Math.abs(nx) < 0.5 ? 1 : 0;
    };

    resize();
    if (still) {
      draw(8);
      return;
    }
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    ro.observe(canvas);
    io.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
