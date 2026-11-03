"use client";

import React, { useRef, useState } from "react";

const chipButton = (active) =>
  `inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 type-small transition-[transform,color,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
    active
      ? "border-accent-strong bg-accent text-on-accent"
      : "border-line-strong text-fg hover:border-accent-strong hover:text-accent-strong"
  }`;

// Tabs layout of components/Resume.js: the tab list and its keyboard
// handling. Each job's detail (with its icons) is rendered on the server and
// passed in as `panels`, in the same order as `tabs` ({ key, company, years }).
export default function ResumeTabs({ tabs, panels }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  const onKeyDown = (event, index) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    setActive(next);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-10">
      <div
        role="tablist"
        aria-label="Companies"
        className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {tabs.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={tab.key}
              ref={(el) => (refs.current[index] = el)}
              id={`resume-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="resume-tab-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(ev) => onKeyDown(ev, index)}
              className={`${chipButton(selected)} text-left lg:justify-between lg:rounded-lg lg:py-2.5`}
            >
              <span>{tab.company}</span>
              <span className={`hidden shrink-0 whitespace-nowrap text-[12px] lg:inline lg:text-[13px] ${selected ? "" : "text-fg-muted"}`}>
                {tab.years}
              </span>
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id="resume-tab-panel"
        aria-labelledby={`resume-tab-${active}`}
        className="rounded-lg bg-surface p-5 shadow-1 lg:min-h-[340px] lg:p-8"
      >
        {panels[active]}
      </div>
    </div>
  );
}
