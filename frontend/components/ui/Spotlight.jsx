"use client";

/** Adds a pointer-following light (+ optional subtle tilt) to a card. Pure CSS vars, no re-renders. */
export default function Spotlight({ as: Tag = "div", tilt = false, className = "", children, ...rest }) {
  function move(e) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--spot", "1");
    if (tilt && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * 3}deg) rotateY(${(x - 0.5) * 4}deg)`;
    }
  }
  function leave(e) {
    e.currentTarget.style.setProperty("--spot", "0");
    e.currentTarget.style.transform = "";
  }
  return (
    <Tag
      className={`spotlight transition-transform duration-700 ease-[var(--ease-out-expo)] ${className}`}
      onPointerMove={move}
      onPointerLeave={leave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
