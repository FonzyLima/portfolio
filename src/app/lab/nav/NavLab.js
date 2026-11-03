"use client";

import React from "react";
import NavigationLab, {
  activeVariants,
  iconVariants,
  layoutVariants,
  menuVariants,
  positionVariants,
  scrollVariants,
  shapeVariants,
  SHAPES_WITH_LAYOUT,
  surfaceVariants,
  themeToggleVariants,
} from "../../../../components/nav/NavigationLab";
import VariantBar, {
  pick,
  useHashParams,
  writeHash,
} from "../../../../components/lab/VariantBar";

// Client half of /lab/nav (page.js): the real nav over the real home page,
// with a floating bar for trying nav variants. The top row picks a section:
// Links (current-page style), Bar (shape, layout, surface, scroll behaviour),
// Mobile (menu, toggle icon, position) or Theme (the light/dark toggle).
// Everything lives in the URL hash,
// e.g. /lab/nav#section=bar&shape=island&surface=inverted&scroll=progress.
//
// The layout's <Navigation /> renders nothing on this route; the preview
// instance below (components/nav/NavigationLab.js, which only this page
// imports) is the only nav here. Its route links don't navigate, they move
// the current-page marker, so the active styles can be compared.
const sections = [
  { id: "links", label: "Links" },
  { id: "bar", label: "Bar" },
  { id: "mobile", label: "Mobile" },
  { id: "theme", label: "Theme" },
];

// Defaults match what the site currently ships (each list's first option).
const defaults = {
  section: "links",
  active: activeVariants[0].id,
  shape: shapeVariants[0].id,
  layout: layoutVariants[0].id,
  surface: surfaceVariants[0].id,
  scroll: scrollVariants[0].id,
  menu: menuVariants[0].id,
  icon: iconVariants[0].id,
  position: positionVariants[0].id,
  theme: themeToggleVariants[0].id,
};

// Links shared before the Bar rows were split up used `section=desktop` and
// a single `bar` key (hide | sticky | floating). Read them into the new keys.
function legacy(params) {
  const bar = params.get("bar");
  return {
    section: params.get("section") === "desktop" ? (bar ? "bar" : "links") : undefined,
    shape: bar === "floating" ? "floating" : undefined,
    scroll: bar === "hide" || bar === "sticky" ? bar : undefined,
  };
}

const PANEL_ID = "nav-lab-panel";

// `children` is the page content (the real home page, rendered on the server
// by page.js), shown under the preview nav.
export default function NavLab({ children }) {
  const params = useHashParams();
  const old = legacy(params);
  // New keys win, except `section`, whose legacy value ("desktop") is itself
  // what gets mapped.
  const get = (key) =>
    key === "section" ? old.section ?? params.get(key) : params.get(key) ?? old[key];
  const state = {
    section: pick(sections, get("section"), defaults.section),
    active: pick(activeVariants, get("active"), defaults.active),
    shape: pick(shapeVariants, get("shape"), defaults.shape),
    layout: pick(layoutVariants, get("layout"), defaults.layout),
    surface: pick(surfaceVariants, get("surface"), defaults.surface),
    scroll: pick(scrollVariants, get("scroll"), defaults.scroll),
    menu: pick(menuVariants, get("menu"), defaults.menu),
    icon: pick(iconVariants, get("icon"), defaults.icon),
    position: pick(positionVariants, get("position"), defaults.position),
    theme: pick(themeToggleVariants, get("theme"), defaults.theme),
  };
  const { section, ...variants } = state;

  // Writing the full state also drops a legacy `bar` key from the hash.
  const update = (next) => writeHash({ ...state, ...next });
  const row = (label, name, ariaLabel, options, extra = {}) => ({
    label,
    name,
    ariaLabel,
    options,
    value: state[name],
    onSelect: (id) => update({ [name]: id }),
    ...extra,
  });

  const rows = {
    links: [row("Active", "active", "Current page style", activeVariants)],
    bar: [
      row("Shape", "shape", "Bar shape", shapeVariants),
      row("Layout", "layout", "Link placement", layoutVariants, {
        dimmed: !SHAPES_WITH_LAYOUT.includes(state.shape),
        hint: "Layout applies to the Full width and Floating shapes",
      }),
      row("Surface", "surface", "Bar surface", surfaceVariants),
      row("Scroll", "scroll", "Scroll behaviour", scrollVariants, {
        dimmed: state.shape === "rail",
        hint: "The rail doesn't hide, shrink or show progress (the phone bar still does)",
      }),
    ],
    mobile: [
      row("Menu", "menu", "Mobile menu layout", menuVariants, {
        dimmed: state.shape === "fab",
        hint: "FAB opens its own popover",
      }),
      row("Icon", "icon", "Menu toggle", iconVariants),
      row("Position", "position", "Mobile bar position", positionVariants, {
        dimmed: state.shape === "fab" || state.shape === "dock",
        hint:
          state.shape === "dock"
            ? "Dock is always docked at the bottom on phones"
            : "FAB has no bar to position",
      }),
    ],
    theme: [row("Toggle", "theme", "Light and dark mode toggle", themeToggleVariants)],
  }[section];
  // Keep the lab's switcher clear of the bar: at the top on phones when the
  // bar is docked at the bottom, and lifted above the Dock shape's pill.
  const placement = [
    state.position === "bottom" || state.shape === "dock" ? "dock" : "",
    state.shape === "dock" ? "raised" : "",
  ]
    .filter(Boolean)
    .join(" ") || "bottom";

  return (
    <>
      <NavigationLab preview {...variants} />

      <div
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={`tab-section-${section}`}
        className="relative pb-40"
      >
        {/* Sits in the gap above the hero without pushing it down, so the
            page (and its absolutely placed glow) lays out exactly like /. */}
        <p className="page-container absolute inset-x-0 top-[72px] z-30 lg:top-[88px] type-small text-fg-muted">
          {/* One line on phones, so it never runs into the hero. */}
          <span className="md:hidden">Nav links here don&apos;t navigate.</span>
          <span className="hidden md:inline">
            Resize below 768px to try the mobile menu and icon. Nav links
            here move the current-page marker instead of navigating.
          </span>
        </p>
        {children}
      </div>

      <VariantBar
        panelId={PANEL_ID}
        placement={placement}
        section={{
          label: "Section",
          name: "section",
          ariaLabel: "Nav lab section",
          options: sections,
          value: section,
          onSelect: (id) => update({ section: id }),
        }}
        rows={rows}
      />
    </>
  );
}
