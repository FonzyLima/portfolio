import { useLayoutEffect, useRef } from "react";
import { EASE_IN_OUT_CSS, MOVE_MS } from "./motion";
import { prefersReducedMotion } from "./config";

// Desktop active-link marker. Every desktop link renders one and only the
// current page's is visible; on a route change the new marker plays a FLIP
// from the old one's box, so it slides between links.
//
// Both markers are in the DOM, so both boxes are read in the same layout pass
// (once per route change, never per frame), then the new marker animates from
// the old box with a transform-only Web Animation. No slide with reduced
// motion or on first render.
//
// It only measures inside `listRef`, so the fixed nav and scroll-to-top on
// navigation never add a vertical jump.
export function useMarkerSlide(listRef, activeHref) {
  const lastHref = useRef(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    const prevHref = lastHref.current;
    lastHref.current = activeHref;
    if (!list || !prevHref || prevHref === activeHref) return;
    const from = list.querySelector(`[data-marker="${prevHref}"]`);
    const to = list.querySelector(`[data-marker="${activeHref}"]`);
    if (!from || !to || to.getClientRects().length === 0 || prefersReducedMotion()) return;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    if (!a.width || !b.width) return;
    to.animate(
      [
        { transform: `translateX(${a.left - b.left}px) scaleX(${a.width / b.width})` },
        { transform: "none" },
      ],
      { duration: MOVE_MS, easing: EASE_IN_OUT_CSS },
    );
  }, [listRef, activeHref]);
}
