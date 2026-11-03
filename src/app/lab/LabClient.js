"use client";

import React, { useEffect, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import VariantBar from "../../../components/lab/VariantBar";
import { LAYOUTS_WITH_CHIPS } from "./labState";

// Client half of /lab (page.js): the variant bar over the real About page,
// which page.js renders on the server and passes in as children. The top row
// picks a section (About me, Skills or Resume); the rows under it switch that
// section's variants. Choosing one replaces the query string, so the server
// re-renders the page with it. `state` is the server's (validated) reading of
// the query; `options` holds each row's variant list.
const PANEL_ID = "about-lab-panel";

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  const { top, bottom } = section.getBoundingClientRect();
  if (top > window.innerHeight * 0.6 || bottom < 120) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function LabClient({ state, options, children }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // The bar shows a choice straight away, before the server has rendered it.
  const [current, setCurrent] = useOptimistic(state);

  // Older links kept the state in the hash (/lab#section=skills&...); move it
  // to the query once.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || window.location.search) return;
    router.replace(`/lab?${hash}`, { scroll: false });
  }, [router]);

  const update = (next) => {
    const merged = { ...current, ...next };
    startTransition(() => {
      setCurrent(merged);
      router.replace(`/lab?${new URLSearchParams(merged)}`, { scroll: false });
    });
    scrollToSection(options.section.find((s) => s.id === merged.section).target);
  };
  const row = (label, name, ariaLabel, extra) => ({
    label,
    name,
    ariaLabel,
    options: options[name],
    value: current[name],
    onSelect: (id) => update({ [name]: id }),
    ...extra,
  });
  const trainerOnly = (what) => ({
    dimmed: current.intro !== "trainer",
    hint: `${what} apply to the Trainer card layout`,
  });

  const rows = {
    intro: [
      row("Layout", "intro", "About me layout"),
      row("Card", "card", "Trainer card style", trainerOnly("Card styles")),
      row("Left", "side", "Trainer card left side", trainerOnly("Left-side layouts")),
      row("Badges", "badge", "Badge style", trainerOnly("Badge styles")),
    ],
    skills: [
      row("Layout", "layout", "Skills layout"),
      row("Chips", "chip", "Skill chip style", {
        dimmed: !LAYOUTS_WITH_CHIPS.includes(current.layout),
        hint: "Chip styles apply to the Cards, Rows and Panel layouts",
      }),
    ],
    resume: [row("Layout", "resume", "Resume layout")],
  }[current.section];

  return (
    <>
      <div
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={`tab-section-${current.section}`}
        aria-busy={isPending || undefined}
        className="pb-40"
      >
        {children}
      </div>

      <VariantBar
        collapsible
        panelId={PANEL_ID}
        section={{
          label: "Section",
          name: "section",
          ariaLabel: "About lab section",
          options: options.section,
          value: current.section,
          onSelect: (id) => update({ section: id }),
        }}
        rows={rows}
      />
    </>
  );
}
