"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { DURATION, EASE_IN_OUT_CSS, indicatorClass } from "../../nav/motion";

const ITEMS = ["Work", "About", "Contact"];

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The nav's sliding underline on three local toggle buttons. They don't
// navigate anywhere. Same technique as the desktop nav (useMarkerSlide in
// components/Navigation.js): every button has a marker, only the active one
// is visible, and on change the new marker plays a transform-only FLIP from
// the old one's box. No slide on first render or with reduced motion.
export default function ActiveIndicatorDemo() {
  const [active, setActive] = useState(ITEMS[0]);
  const groupRef = useRef(null);
  const last = useRef(null);

  useLayoutEffect(() => {
    const group = groupRef.current;
    const prev = last.current;
    last.current = active;
    if (!group || !prev || prev === active || prefersReducedMotion()) return;
    const from = group.querySelector(`[data-marker="${prev}"]`);
    const to = group.querySelector(`[data-marker="${active}"]`);
    if (!from || !to) return;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    if (!a.width || !b.width) return;
    to.animate(
      [
        { transform: `translateX(${a.left - b.left}px) scaleX(${a.width / b.width})` },
        { transform: "none" },
      ],
      { duration: DURATION.move * 1000, easing: EASE_IN_OUT_CSS },
    );
  }, [active]);

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label="Sliding indicator demo"
      className="flex flex-wrap items-center justify-center gap-1"
    >
      {ITEMS.map((label) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActive(label)}
            className={`flex h-11 items-center rounded-lg px-3 type-small transition-colors duration-150 ${
              isActive ? "text-accent-strong" : "text-fg hover:text-fg-muted"
            }`}
          >
            <span className="relative">
              {label}
              <span
                aria-hidden="true"
                data-marker={label}
                className={`${indicatorClass} origin-left ${isActive ? "" : "invisible"}`}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
