"use client";
import { useContext, useId } from "react";
import DarkContext from "@/app/context/darkContext";
import { BsMoonFill } from "react-icons/bs";
import { SunIcon } from "./icons";

// Theme toggle variants, tried out at /lab/nav (Theme section). The site nav
// ships Segmented; "swap" (the earlier sun/moon icon) is ThemeButton in
// ./parts.js.
//
// Every variant draws its state from the `dark` class on <html> (`dark:`
// transform/opacity utilities and `.dark` rules in globals.css, "Theme
// toggle variants"), never from React state. So it's right before hydration
// (the inline script sets the class before first paint) and it animates on
// its own whenever the class flips, whoever flips it. `isDark` (null until
// mounted) only feeds the ARIA state. Motion is 240ms ease-in-out, and
// instant with reduced motion.

const MOON = <BsMoonFill size={19} aria-hidden="true" focusable="false" />;

// Accessible name for the one-button variants: what clicking does.
const actionLabel = (isDark) =>
  isDark === null
    ? "Switch theme"
    : isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

// Eclipse: one icon that morphs. In light mode it's a crescent moon (a cut
// circle masks the body); switching, the cut slides away, the body shrinks to
// the sun's core and the rays grow out of it. Like the swap toggle, it shows
// the mode you'd switch to.
function EclipseIcon() {
  // Masks are referenced by id and the toggle renders in several places at
  // once (phone bar and desktop pieces), so each needs its own.
  const maskId = `theme-eclipse-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="theme-eclipse"
    >
      <mask id={maskId}>
        <rect width="24" height="24" fill="white" />
        <circle className="theme-eclipse-cut" cx="17" cy="7" r="7" fill="black" />
      </mask>
      <circle
        className="theme-eclipse-body"
        cx="12"
        cy="12"
        r="9"
        fill="currentColor"
        mask={`url(#${maskId})`}
      />
      <g className="theme-eclipse-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {rays.map((angle) => (
          <line key={angle} x1="12" y1="2" x2="12" y2="4" transform={`rotate(${angle} 12 12)`} />
        ))}
      </g>
    </svg>
  );
}

// Two icons stacked in one box, the visible one picked by the `dark` class.
function StackedIcons({ light, dark, className = "" }) {
  return (
    <span className={`relative grid place-items-center ${className}`}>
      <span className="theme-fade [grid-area:1/1] opacity-100 dark:opacity-0">{light}</span>
      <span className="theme-fade [grid-area:1/1] opacity-0 dark:opacity-100">{dark}</span>
    </span>
  );
}


// Segmented: two buttons, Light and Dark, with a thumb that slides behind
// the current one. The site nav ships this one (components/Navigation.js);
// it's its own export so the site bundle doesn't carry the lab's other
// variants. Stacks vertically in the lab's rail (88px wide).
export function SegmentedThemeToggle({ className = "", vertical = false }) {
  const [isDark, setDark] = useContext(DarkContext);
  // Round focus rings, drawn just inside each 44px segment.
  const segment =
    "relative z-10 flex h-11 w-11 items-center justify-center rounded-full theme-fade focus-visible:outline-offset-[-2px]";
  return (
    <div
      role="group"
      aria-label="Theme"
      className={`relative flex shrink-0 rounded-full bg-fg/10 ${vertical ? "flex-col" : "flex-row"} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`theme-slide pointer-events-none absolute left-1 top-1 h-9 w-9 rounded-full bg-surface-raised shadow-1 ${
          vertical ? "dark:translate-y-11" : "dark:translate-x-11"
        }`}
      />
      <button
        type="button"
        aria-label="Light mode"
        aria-pressed={isDark === null ? undefined : !isDark}
        className={`${segment} opacity-100 dark:opacity-50 hover:opacity-100 [&_svg]:h-[18px] [&_svg]:w-[18px]`}
        onClick={() => setDark(false)}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        aria-label="Dark mode"
        aria-pressed={isDark === null ? undefined : isDark}
        className={`${segment} opacity-50 dark:opacity-100 hover:opacity-100 [&_svg]:h-4 [&_svg]:w-4`}
        onClick={() => setDark(true)}
      >
        {MOON}
      </button>
    </div>
  );
}

export const themeToggleVariants = [
  // First is the default, which is what the site nav ships.
  { id: "segmented", label: "Segmented" },
  { id: "swap", label: "Swap" },
  { id: "eclipse", label: "Eclipse" },
  { id: "switch", label: "Switch" },
  { id: "label", label: "Label" },
];

// How far each variant pulls into the row's right edge, replacing the icon
// toggle's -mr-[11px] (which lines a 22px glyph in a 44px box up with the
// edge): the switch track is 40px in a 44px box, the label has px-3 and the
// segmented pill's edge is its visible edge. Navigation.js swaps these in
// at runtime, keeping any breakpoint prefix, so Tailwind needs the prefixed
// classes spelled out somewhere it scans: md:-mr-0.5 md:-mr-3.
export const THEME_TOGGLE_PULL = {
  swap: null,
  eclipse: null,
  switch: "-mr-0.5",
  segmented: "",
  label: "-mr-3",
};

export default function ThemeToggle({
  variant,
  isDark,
  setDark,
  className = "",
  // The nav's 44px icon button and focus-ring classes, so every variant
  // matches the other nav buttons.
  iconButtonClass,
  focusRing,
  vertical = false,
}) {
  if (variant === "eclipse") {
    return (
      <button
        type="button"
        aria-label={actionLabel(isDark)}
        className={`${iconButtonClass} ${className}`}
        onClick={() => setDark((dark) => !dark)}
      >
        <EclipseIcon />
      </button>
    );
  }

  if (variant === "switch") {
    // A real switch: "Dark mode", on or off. The thumb carries the current
    // mode's icon and slides right for dark.
    return (
      <button
        type="button"
        role="switch"
        aria-label="Dark mode"
        aria-checked={isDark === null ? undefined : isDark}
        className={`${iconButtonClass} ${className}`}
        onClick={() => setDark((dark) => !dark)}
      >
        <span
          aria-hidden="true"
          className="relative block h-6 w-10 rounded-full bg-fg/10 shadow-[inset_0_0_0_0.5px_rgb(var(--line-strong))]"
        >
          <span className="theme-slide absolute left-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-fg text-page dark:translate-x-4">
            <StackedIcons
              light={<SunIcon />}
              dark={MOON}
              className="h-3 w-3 [&_svg]:h-3 [&_svg]:w-3"
            />
          </span>
        </span>
      </button>
    );
  }

  if (variant === "segmented") {
    return <SegmentedThemeToggle className={className} vertical={vertical} />;
  }

  if (variant === "label") {
    // The word for the mode you'd switch to, like the Label menu toggle's
    // "Menu" / "Close". Both words share one grid cell, so the button keeps
    // the wider word's width.
    return (
      <button
        type="button"
        aria-label={actionLabel(isDark)}
        className={`flex h-11 min-w-[44px] items-center justify-center px-3 text-fg-muted hover:text-fg ${focusRing} focus-visible:outline-offset-0 ${className}`}
        onClick={() => setDark((dark) => !dark)}
      >
        <span aria-hidden="true" className="grid type-small">
          <span className="theme-fade text-center [grid-area:1/1] opacity-100 dark:opacity-0">
            Dark
          </span>
          <span className="theme-fade text-center [grid-area:1/1] opacity-0 dark:opacity-100">
            Light
          </span>
        </span>
      </button>
    );
  }

  return null;
}
