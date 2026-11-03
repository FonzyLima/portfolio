import { useLayoutEffect, useRef } from "react";
import { DURATION, EASE_IN_OUT_CSS } from "./motion";
import { prefersReducedMotion } from "./config";

// Desktop active-link marker. Every desktop link renders one and only the
// current page's is visible; on a route change the new marker plays a FLIP
// from the old one's box, so it slides between links.
//
// Both markers are in the DOM, so both boxes are read in the same layout pass
// (once per route change, never per frame), then the new marker animates from
// the old box with a transform-only Web Animation. No slide with reduced
// motion, on first render, or when `variant` (the lab's marker style) changes,
// so one shape never morphs into another.
//
// It only measures inside `listRef`, so the fixed nav and scroll-to-top on
// navigation never add a vertical jump.
export function useMarkerSlide(listRef, activeHref, variant) {
  const last = useRef(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    const prev = last.current;
    last.current = { href: activeHref, variant };
    if (!list || !prev || prev.href === activeHref || prev.variant !== variant) return;
    const from = list.querySelector(`[data-marker="${prev.href}"]`);
    const to = list.querySelector(`[data-marker="${activeHref}"]`);
    if (!from || !to || to.getClientRects().length === 0 || prefersReducedMotion()) return;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    if (!a.width || !b.width) return;
    // Links in a column (the lab's rail) also move vertically.
    const dy = a.top - b.top;
    const move =
      Math.abs(dy) < 0.5
        ? `translateX(${a.left - b.left}px)`
        : `translate(${a.left - b.left}px, ${dy}px)`;
    to.animate(
      [
        { transform: `${move} scaleX(${a.width / b.width})` },
        { transform: "none" },
      ],
      { duration: DURATION.move * 1000, easing: EASE_IN_OUT_CSS },
    );
  }, [listRef, activeHref, variant]);
}
