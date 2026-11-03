"use client";

import React, { useLayoutEffect, useRef } from "react";

// One raised track (bg-surface, shadow-1) holding toggle buttons, with a green
// pill that slides to the selected one. Used by the /portfolio filters.
//   options:  [{ id, label, shortLabel?, count? }]
//   value:    selected id
//   onChange: (id) => void
//
// The pill is positioned from the selected button's offsetLeft/offsetWidth,
// written straight to the DOM (no state, so no extra render). Until the first
// measurement, i.e. in the server HTML and before hydration, the selected
// button paints its own green fill, so there is never a frame without a
// selection. Reduced motion: the pill jumps instead of sliding.
export default function SegmentedFilter({ options, value, onChange, label }) {
  const trackRef = useRef(null);
  const pillRef = useRef(null);
  const buttonRefs = useRef(new Map());

  useLayoutEffect(() => {
    const track = trackRef.current;
    const pill = pillRef.current;
    if (!track || !pill) return;

    const place = () => {
      const button = buttonRefs.current.get(value);
      if (!button) return;
      pill.style.width = `${button.offsetWidth}px`;
      pill.style.transform = `translateX(${button.offsetLeft}px)`;
      if (!track.dataset.ready) {
        // Commit the first position before transitions switch on, so the
        // pill appears in place instead of sliding in from the left edge.
        void pill.offsetWidth;
        track.dataset.ready = "true";
      }
    };

    place();
    // Labels change width when the web font loads and at the sm breakpoint.
    const observer = new ResizeObserver(place);
    buttonRefs.current.forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, [value, options]);

  return (
    <div
      ref={trackRef}
      role="group"
      aria-label={label}
      className="group/track relative flex w-full rounded-full bg-surface p-1 shadow-1 sm:inline-flex sm:w-auto"
    >
      <span
        ref={pillRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-0 w-0 rounded-full bg-accent ring-1 ring-inset ring-accent-strong opacity-0 group-data-[ready=true]/track:opacity-100 group-data-[ready=true]/track:motion-safe:transition-[transform,width] group-data-[ready=true]/track:motion-safe:duration-[240ms] group-data-[ready=true]/track:motion-safe:ease-[cubic-bezier(0.77,0,0.175,1)]"
      />
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <button
            key={option.id}
            ref={(node) => {
              if (node) buttonRefs.current.set(option.id, node);
              else buttonRefs.current.delete(option.id);
            }}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
            className={`relative z-[1] flex min-h-[44px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 type-small transition-[transform,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] sm:flex-none sm:px-4 ${
              // Selected also gets a ring (on the pill) and medium weight, so the
              // state doesn't rely on the green fill's low contrast alone.
              selected
                ? "bg-accent font-medium text-on-accent ring-1 ring-inset ring-accent-strong group-data-[ready=true]/track:bg-transparent group-data-[ready=true]/track:ring-0"
                : "text-fg hover:text-accent-strong"
            }`}
          >
            {option.shortLabel ? (
              <>
                <span className="sm:hidden">{option.shortLabel}</span>
                <span className="hidden sm:inline">{option.label}</span>
              </>
            ) : (
              option.label
            )}
            {option.count != null && (
              <span
                className={`hidden text-[12px] tabular-nums transition-colors duration-200 min-[360px]:inline lg:text-[13px] ${
                  selected ? "text-on-accent" : "text-fg-muted"
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
