import React from "react";
import { FiArrowDown, FiArrowRight, FiArrowUpRight } from "react-icons/fi";

// One button system for the whole site: <Button> (CTAs) and the project card
// actions both use these. Pills (rounded-full) to match the chips, the
// segmented filter and the theme toggle.
//   primary:   green fill, the one main action in a group
//   secondary: soft tonal fill (bg-fg/10, like the theme toggle's track), for
//              the second action next to a primary. No outline: a 1px
//              line-strong ring read heavier than the primary it sits beside.
//
// Hover: the hover fill wipes in from the left (a ::before behind the label,
// scaleX 0 -> 1, 200ms ease-out). `isolate` gives the button its own stacking
// context, so the -z-10 layer paints above the button's background but under
// its text and icons. With reduced motion the fill switches instantly.
// Press: active:scale-[0.97].
const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

const BASE = `group/btn relative isolate inline-flex min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-[15px] font-medium transition-[transform,color,background-color] duration-150 ${EASE_OUT} active:scale-[0.97] before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-200 before:ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:before:transition-none`;

export const BUTTON_VARIANTS = {
  primary: "bg-accent text-on-accent before:bg-accent-hover",
  // 10% + a 7% layer comes out at about 16%, the old hover fill.
  secondary: "bg-fg/10 text-fg before:bg-fg/[0.07]",
};

export function buttonClass(variant = "primary") {
  return `${BASE} ${BUTTON_VARIANTS[variant]} hover:before:scale-x-100`;
}

// Trailing icons say where a button goes. On hover the arrow loops: it leaves
// the way it points and a copy comes in behind it, inside an 18px clip
// (200ms ease-out). Motion-safe only; with reduced motion it stays put.
//   next:     another page on this site (→)
//   down:     further down this page (↓)
//   external: leaves the site, opens in a new tab (↗)
const ICONS = { next: FiArrowRight, down: FiArrowDown, external: FiArrowUpRight };

// Written out in full so Tailwind can find the classes.
const LOOP_OUT = {
  next: "motion-safe:group-hover/btn:translate-x-full",
  down: "motion-safe:group-hover/btn:translate-y-full",
  external: "motion-safe:group-hover/btn:translate-x-full motion-safe:group-hover/btn:-translate-y-full",
};
const LOOP_IN = {
  next: "-translate-x-full motion-safe:group-hover/btn:translate-x-0",
  down: "-translate-y-full motion-safe:group-hover/btn:translate-y-0",
  external:
    "-translate-x-full translate-y-full motion-safe:group-hover/btn:translate-x-0 motion-safe:group-hover/btn:translate-y-0",
};

const ICON = "h-[18px] w-[18px] shrink-0";

export function ButtonIcon({ type }) {
  const Icon = ICONS[type];
  if (!Icon) return null;
  const move = `absolute inset-0 ${ICON} duration-200 ${EASE_OUT} motion-safe:transition-transform`;
  return (
    <span aria-hidden="true" className={`relative inline-block overflow-hidden ${ICON}`}>
      <Icon className={`${move} ${LOOP_OUT[type]}`} />
      <Icon className={`${move} ${LOOP_IN[type]}`} />
    </span>
  );
}
