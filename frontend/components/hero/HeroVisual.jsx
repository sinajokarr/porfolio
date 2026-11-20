"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/site";

/**
 * Hero portrait, art-directed: a chrome ribbon sculpture behind Sina's graded photo, a soft shadow that
 * separates him from the metal, and a slow silver sheen across the photo. Layers sit at different depths
 * for a restrained pointer parallax.
 * The sculpture is a pre-rendered still everywhere; on desktops with motion allowed, the live WebGL version
 * (./sculpture.js, loaded lazily) fades in over it from the identical first frame.
 */
const W = 796;
const H = 1038;

export default function HeroVisual({ alt }) {
  const root = useRef(null);
  const sculpture = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !document.documentElement.classList.contains("motion")) return;
    el.classList.add("hero-reveal"); // entrance (CSS keyframes, see globals.css)
    if (!matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return; // phones/tablets keep the still

    // Damped pointer parallax: CSS variables for the layers, the same values feed the sculpture's tilt.
    const pointer = { x: 0, y: 0 };
    let tx = 0, ty = 0, raf = 0, stop = null, cancelled = false;
    const tick = () => {
      pointer.x += (tx - pointer.x) * 0.05;
      pointer.y += (ty - pointer.y) * 0.05;
      el.style.setProperty("--px", pointer.x.toFixed(4));
      el.style.setProperty("--py", pointer.y.toFixed(4));
      raf = Math.abs(tx - pointer.x) + Math.abs(ty - pointer.y) > 0.0005 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });

    // Live sculpture after the page has settled; any failure leaves the still in place.
    const later = window.requestIdleCallback || ((fn) => setTimeout(fn, 600));
    later(() =>
      import("./sculpture")
        .then(({ mountSculpture }) => {
          if (cancelled || !canvas.current) return;
          stop = mountSculpture(canvas.current, { pointer, onFirstFrame: () => sculpture.current?.classList.add("is-live") });
        })
        .catch(() => {}),
    );

    return () => {
      cancelled = true;
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      stop?.();
    };
  }, []);

  const layer = (depth) => ({ transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth * 0.6}px), 0)` });

  return (
    <div ref={root} className="absolute inset-0">
      <div className="hero-layer absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgb(170_169_245/0.16),transparent_72%)]" style={layer(-16)} aria-hidden="true" />

      <div ref={sculpture} className="hero-layer hero-sculpture absolute inset-0" style={layer(-9)} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-rendered transparent still of the shader */}
        <img src={asset("/hero-sculpture.webp")} alt="" width="1400" height="1400" decoding="async" className="hero-sculpture-still still-night size-full select-none object-contain" />
        {/* eslint-disable-next-line @next/next/no-img-element -- same still, day-studio lighting for light mode */}
        <img src={asset("/hero-sculpture-light.webp")} alt="" width="1400" height="1400" decoding="async" loading="lazy" className="hero-sculpture-still still-day absolute inset-0 size-full select-none object-contain" />
        <canvas ref={canvas} className="absolute inset-0 size-full" />
      </div>

      {/* Stage = the photo's box: bottom-centred, 80% of the visual's height. */}
      <div className="hero-layer hero-portrait absolute bottom-0 left-1/2 h-[80%] -translate-x-1/2" style={{ ...layer(5), aspectRatio: `${W} / ${H}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-graded cut-out; next/image would re-encode the alpha */}
        <img src={asset("/hero-portrait.webp")} alt={alt} width={W} height={H} fetchPriority="high" className="hero-photo size-full select-none object-contain" />
        <div className="hero-sheen absolute inset-0" style={{ maskImage: `url(${asset("/hero-portrait.webp")})`, WebkitMaskImage: `url(${asset("/hero-portrait.webp")})` }} aria-hidden="true" />
      </div>
    </div>
  );
}
