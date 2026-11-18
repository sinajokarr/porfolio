"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Native scroll-snap carousel; arrows scroll by one card and respect RTL. */
export default function WorkCarousel({ children, prevLabel, nextLabel }) {
  const track = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const pos = Math.abs(el.scrollLeft); // scrollLeft is negative in RTL
    setEdges({ start: pos < 8, end: pos + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  function go(direction) {
    const el = track.current;
    const card = el.querySelector("li");
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * (card ? card.offsetWidth + 20 : el.clientWidth), behavior: "smooth" });
  }

  const btn = "grid size-12 place-items-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-white/50 hover:bg-white hover:text-ink disabled:pointer-events-none disabled:opacity-30";
  return (
    <div>
      <ul ref={track} onScroll={update} className="no-scrollbar -mx-[clamp(1.25rem,4.5vw,4.5rem)] flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-[clamp(1.25rem,4.5vw,4.5rem)] px-[clamp(1.25rem,4.5vw,4.5rem)] pb-2 xl:mx-0 xl:scroll-px-0 xl:px-0">
        {children}
      </ul>
      <div className="mt-8 flex gap-3 xl:absolute xl:bottom-0 xl:start-0 xl:mt-0">
        <button type="button" className={btn} onClick={() => go(-1)} disabled={edges.start} aria-label={prevLabel}>
          <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </button>
        <button type="button" className={btn} onClick={() => go(1)} disabled={edges.end} aria-label={nextLabel}>
          <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
