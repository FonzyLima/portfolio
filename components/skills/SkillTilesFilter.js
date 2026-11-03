"use client";

import React, { useState } from "react";

// Filter chips for the Tiles layout of components/TechnicalSkills.js. The
// tiles (icons included) are rendered by the server and passed in as nodes;
// this only holds the selected filter, so no icon code ships to the browser.
//   filters: [{ id, label, count }], "all" first
//   tiles:   [{ key, group, node }], `group` matching a filter id
export default function SkillTilesFilter({ filters, tiles }) {
  const [active, setActive] = useState("all");
  const shown = active === "all" ? tiles : tiles.filter((t) => t.group === active);

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-wrap gap-3" aria-label="Skill filters">
        {filters.map((filter) => {
          const isActive = filter.id === active;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActive(filter.id)}
              aria-pressed={isActive}
              className={`flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 type-small transition-[transform,color,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                isActive
                  ? "border-accent-strong bg-accent text-on-accent"
                  : "border-line-strong text-fg hover:border-accent-strong hover:text-accent-strong"
              }`}
            >
              <span className="font-normal">{filter.label}</span>
              <span
                className={`flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-[12px] lg:text-[13px] ${
                  isActive
                    ? "bg-page text-fg"
                    : "bg-placeholder text-fg"
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-5">
        {shown.map(({ key, node }) => (
          <React.Fragment key={key}>{node}</React.Fragment>
        ))}
      </ul>
    </div>
  );
}
