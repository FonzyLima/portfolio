"use client";

import React from "react";
import {
  actionVariants,
  clickVariants,
  gridVariants,
  FULL_WIDTH_LAYOUTS,
  hoverVariants,
  innerVariants,
  layoutVariants,
  tagStyleVariants,
  tagToolVariants,
  tagVariants,
  textVariants,
} from "../../../../components/Project";
import CardVariantContext from "../../../../components/CardVariantContext";
import VariantBar, {
  pick,
  useHashParams,
  writeHash,
} from "../../../../components/lab/VariantBar";

// Client half of /lab/cards (page.js): the real portfolio page with a floating
// bar for trying project-card variants. The top row picks Card (layout,
// grid, inside arrangement), Tags (position, style, tools), Content (text, actions) or Feel
// (hover, click), so no section has more than three rows. The choice reaches the grid through
// CardVariantContext (read by PortfolioFilters). State lives in the URL hash,
// e.g. /lab/cards#section=content&layout=showcase&tags=overlap&actions=labeled.
const sections = [
  { id: "card", label: "Card" },
  { id: "tags", label: "Tags" },
  { id: "content", label: "Content" },
  { id: "feel", label: "Feel" },
];

// Each list's first option, which is what the site ships.
const defaults = {
  section: "card",
  layout: layoutVariants[0].id,
  grid: gridVariants[0].id,
  tags: tagVariants[0].id,
  tagStyle: tagStyleVariants[0].id,
  tagTools: tagToolVariants[0].id,
  text: textVariants[0].id,
  actions: actionVariants[0].id,
  inner: innerVariants[0].id,
  hover: hoverVariants[0].id,
  click: clickVariants[0].id,
};

const PANEL_ID = "card-lab-panel";

export default function CardLab({ children }) {
  const params = useHashParams();
  const state = {
    section: pick(sections, params.get("section"), defaults.section),
    layout: pick(layoutVariants, params.get("layout"), defaults.layout),
    grid: pick(gridVariants, params.get("grid"), defaults.grid),
    tags: pick(tagVariants, params.get("tags"), defaults.tags),
    tagStyle: pick(tagStyleVariants, params.get("tagStyle"), defaults.tagStyle),
    tagTools: pick(tagToolVariants, params.get("tagTools"), defaults.tagTools),
    text: pick(textVariants, params.get("text"), defaults.text),
    actions: pick(actionVariants, params.get("actions"), defaults.actions),
    inner: pick(innerVariants, params.get("inner"), defaults.inner),
    hover: pick(hoverVariants, params.get("hover"), defaults.hover),
    click: pick(clickVariants, params.get("click"), defaults.click),
  };
  const { section, ...card } = state;
  const update = (next) => writeHash({ ...state, ...next });
  const row = (label, name, ariaLabel, options, extra) => ({
    label,
    name,
    ariaLabel,
    options,
    value: state[name],
    onSelect: (id) => update({ [name]: id }),
    ...extra,
  });

  // Original is the old card, so the newer options don't apply to it; Row
  // is already all wide cards, so "Feature first" doesn't apply there.
  const showcaseOnly = {
    dimmed: card.layout === "stacked",
    hint: "Doesn't apply to the Original card",
  };
  const rows = {
    card: [
      row("Card", "layout", "Card layout", layoutVariants),
      row("Grid", "grid", "Grid layout", gridVariants, {
        dimmed: card.layout === "stacked" || FULL_WIDTH_LAYOUTS.includes(card.layout),
        hint: "Doesn't apply to Row, Zigzag and Index (one card per line) or Original",
      }),
      row("Inside", "inner", "Card content arrangement", innerVariants, {
        dimmed: card.layout === "stacked",
        hint: "Doesn't apply to the Original card",
      }),
    ],
    tags: [
      row("Position", "tags", "Tag position", tagVariants, showcaseOnly),
      row("Style", "tagStyle", "Tag style", tagStyleVariants, showcaseOnly),
      row("Tools", "tagTools", "Tools shown", tagToolVariants, showcaseOnly),
    ],
    content: [
      row("Text", "text", "Card text", textVariants, {
        ...showcaseOnly,
        hint: "Doesn't apply to Original (the featured card always shows the full text)",
      }),
      row("Actions", "actions", "Project links style", actionVariants, showcaseOnly),
    ],
    feel: [
      row("Hover", "hover", "Card hover effect", hoverVariants),
      row("Click", "click", "Card click target", clickVariants),
    ],
  }[section];

  return (
    <>
      <div
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={`tab-section-${section}`}
        className="pb-56"
      >
        <CardVariantContext.Provider value={card}>
          {children}
        </CardVariantContext.Provider>
      </div>

      <VariantBar
        panelId={PANEL_ID}
        section={{
          label: "Section",
          name: "section",
          ariaLabel: "Card lab section",
          options: sections,
          value: section,
          onSelect: (id) => update({ section: id }),
        }}
        rows={rows}
      />
    </>
  );
}
