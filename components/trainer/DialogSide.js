"use client";

import React, { useState } from "react";
import { profile } from "@/app/data/portfolioData";

/* Dialog side of the trainer-card intro (components/TrainerSide.js): the copy
   in an RPG-style dialog box you page through, matching the trainer card.
   Pages: summary, intro, education. `heading` is the section's <h1>. */
export default function DialogSide({ heading }) {
  const pages = [profile.summary, profile.intro, profile.education].filter(Boolean);
  const [page, setPage] = useState(0);
  const last = page === pages.length - 1;

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      {heading}
      <div className="flex flex-col">
        {/* The tab overlaps the box's top border so the two read as one shape. */}
        <span className="relative z-10 -mb-0.5 self-start rounded-t-lg border-2 border-b-0 border-fg/80 bg-surface px-3 pb-1.5 pt-1 type-small font-medium text-fg">
          {profile.name.split(" ")[0]}
        </span>
        <div className="rounded-lg rounded-tl-none border-2 border-fg/80 bg-surface p-1 shadow-1">
          <div className="flex min-h-[220px] flex-col gap-4 rounded-[6px] border border-line p-5 lg:min-h-[240px] lg:p-6">
            <p className="type-lead max-w-[60ch] text-fg" aria-live="polite">
              {pages[page]}
            </p>
            <div className="mt-auto flex items-center justify-between gap-4">
              <div className="flex gap-1.5" aria-hidden="true">
                {pages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                      i === page ? "w-5 bg-accent" : "w-1.5 bg-line"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPage(last ? 0 : page + 1)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 type-small text-fg transition-[transform,color] duration-150 ease-out hover:text-accent-strong active:scale-[0.97]"
              >
                {last ? "Start over" : "Next"}
                <span aria-hidden="true" className={`text-accent-strong ${last ? "" : "motion-safe:animate-pulse"}`}>
                  ▼
                </span>
                <span className="sr-only">
                  , page {page + 1} of {pages.length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
