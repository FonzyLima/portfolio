"use client";

import { useLayoutEffect, useRef } from "react";

// Horizontal scroller for the contribution graph. On narrow screens the graph
// is wider than the card, so start scrolled to the right: the most recent weeks
// are the interesting ones. Focusable so keyboard users can scroll it too.
export default function HeatmapScroll({ label, children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label={label}
      className="-mx-5 overflow-x-auto px-5 pb-2 focus-visible:rounded-lg lg:-mx-6 lg:px-6"
    >
      {children}
    </div>
  );
}
