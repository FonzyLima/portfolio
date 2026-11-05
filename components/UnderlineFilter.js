"use client";

import React, { useRef } from "react";
import { LinkLabel } from "./nav/parts";
import { linkClass } from "./nav/config";
import { useMarkerSlide } from "./nav/useMarkerSlide";

// A row of toggle buttons styled like the desktop nav links: the selected one
// is text-accent-strong with the nav's 3px underline, which slides between
// options (same FLIP as the nav, via useMarkerSlide). Used by the /projects
// filters.
//   options:  [{ id, label, shortLabel?, count? }]
//   value:    selected id
//   onChange: (id) => void
//
// Every option renders a marker and only the selected one is visible, so the
// server HTML already shows the selection. Reduced motion: no slide.
export default function UnderlineFilter({ options, value, onChange, label }) {
  const listRef = useRef(null);
  useMarkerSlide(listRef, value);

  return (
    <div
      ref={listRef}
      role="group"
      aria-label={label}
      // Negative margin so the first label lines up with the page text.
      className="-ml-2 flex flex-wrap items-center gap-x-1 sm:-ml-3 sm:gap-x-2"
    >
      {options.map((option) => {
        const selected = option.id === value;
        const text = option.shortLabel ? (
          <>
            <span className="sm:hidden">{option.shortLabel}</span>
            <span className="hidden sm:inline">{option.label}</span>
          </>
        ) : (
          option.label
        );
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
            className={`min-h-[44px] gap-1.5 whitespace-nowrap px-2 transition-colors duration-200 sm:px-3 ${linkClass(selected)} ${
              // Medium weight too, so the state isn't colour + line alone.
              selected ? "font-medium" : ""
            }`}
          >
            <LinkLabel label={text} isActive={selected} markerFor={option.id} />
            {option.count != null && (
              <span className="hidden text-[12px] tabular-nums text-fg-muted min-[360px]:inline lg:text-[13px]">
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
