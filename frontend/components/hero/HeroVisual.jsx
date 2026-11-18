"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SCENE } from "./scene";

// three.js loads only in the browser, after the page is interactive.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The static portrait renders first (it is the LCP image and the no-WebGL fallback). The live scene —
 * the same portrait on a plane plus the orbiting glass rings — fades in on top once its first frame is ready.
 * The plane and the <img> share one layout (bottom-centred, SCENE.portrait.height of the box), so the
 * hand-off is seamless. Rendering pauses while the hero is off-screen; reduced motion gets a still frame.
 */
export default function HeroVisual({ alt }) {
  const ref = useRef(null);
  const [mode, setMode] = useState(null); // null | "static" | { quality, still }
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const schedule = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = schedule(() => {
      if (!webglAvailable()) return setMode("static");
      const small = matchMedia("(max-width: 1023px)").matches || (navigator.hardwareConcurrency || 8) <= 4;
      setMode({ quality: small ? "low" : "high", still: matchMedia("(prefers-reduced-motion: reduce)").matches });
    }, { timeout: 900 });
    return () => cancel(id);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element -- same URL as the WebGL texture, so it downloads once */}
      <img
        src={SCENE.portrait.src}
        alt={alt}
        width={796}
        height={1038}
        fetchPriority="high"
        style={{ height: `${SCENE.portrait.height * 100}%` }}
        className={`absolute bottom-0 left-1/2 w-auto max-w-none -translate-x-1/2 select-none transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {mode && mode !== "static" && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroScene active={visible} still={mode.still} quality={mode.quality} onReady={onReady} />
        </div>
      )}
    </div>
  );
}
