"use client";

import React, { useState } from "react";

// Tappable gym badges plus a caption naming the selected one, so the company
// and role are visible on touch screens too (a `title` tooltip never shows
// there). In the earned look the badges sit in sockets, with locked slots
// after them. Client leaf of components/TrainerCard.js: the badge graphics
// (`badge` per item, `lockedBadge`) are rendered on the server.
//   items: [{ key, company, role, years, tenure, badge }]
export default function BadgePicker({ items, initial = 0, earned, locked = 0, lockedBadge }) {
  const [selected, setSelected] = useState(initial);
  const job = items[selected];
  const socket = earned ? "bg-page/70 shadow-[inset_0_1px_3px_rgb(0_0_0/0.18)]" : "";

  return (
    <div className="flex flex-col gap-3">
      {/* Two rows of four, like a game badge case (keeps 44px tap targets). */}
      <ul
        className={earned ? "grid w-fit grid-cols-4 gap-1.5" : "flex flex-wrap gap-1"}
        aria-label="Gym badges"
      >
        {items.map((item, i) => (
          <li key={item.key}>
            <button
              type="button"
              aria-pressed={i === selected}
              aria-label={`${item.company}: ${item.role}, ${item.years}, ${item.tenure}`}
              onClick={() => setSelected(i)}
              className={`flex h-11 w-11 items-center justify-center rounded-lg transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.94] ${socket} ${
                i === selected
                  ? earned
                    ? "ring-2 ring-accent"
                    : "bg-page"
                  : earned
                    ? ""
                    : "hover:bg-page/60"
              }`}
            >
              {item.badge}
            </button>
          </li>
        ))}
        {Array.from({ length: locked }, (_, i) => (
          <li
            key={`locked-${i}`}
            aria-hidden="true"
            className={`flex h-11 w-11 items-center justify-center rounded-lg ${socket}`}
          >
            {lockedBadge}
          </li>
        ))}
      </ul>
      {locked > 0 && <p className="sr-only">{locked} badges still locked.</p>}
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5" aria-live="polite">
        <span className="type-small font-medium text-fg">{job.company}</span>
        <span className="text-[12px] text-fg-muted lg:text-[13px]">{job.role}</span>
        <span className="flex flex-wrap gap-x-3 text-[12px] text-fg-muted lg:text-[13px]">
          <span>{job.years}</span>
          <span>{job.tenure}</span>
        </span>
      </p>
    </div>
  );
}
