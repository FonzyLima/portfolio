import React from "react";
import { FiArrowDown, FiArrowRight, FiArrowUpRight } from "react-icons/fi";

// One button system for the whole site: <Button> (CTAs) and the project card
// actions both use these. Pills (rounded-full) to match the chips, the
// segmented filter and the theme toggle.
//   primary:   green fill, the one main action in a group
//   secondary: soft tonal fill (bg-fg/10, like the theme toggle's track), for
//              the second action next to a primary. No outline: a 1px
//              line-strong ring read heavier than the primary it sits beside.
const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

const BASE = `group/btn inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium transition-[transform,color,background-color] duration-150 ${EASE_OUT} active:scale-[0.97]`;

export const BUTTON_VARIANTS = {
  primary: "bg-accent text-on-accent",
  secondary: "bg-fg/10 text-fg",
};

// Hover fills, split out so a card in whole-card mode can drive the same
// change from the card's hover (`group-hover:`) instead of the button's.
export const BUTTON_HOVER = {
  primary: "hover:bg-accent-hover",
  secondary: "hover:bg-fg/[0.16]",
};
export const BUTTON_GROUP_HOVER = {
  primary: "group-hover:bg-accent-hover",
  secondary: "group-hover:bg-fg/[0.16]",
};

export function buttonClass(variant = "primary", { hover = "self" } = {}) {
  const hoverClass =
    hover === "group" ? BUTTON_GROUP_HOVER[variant] : hover === "self" ? BUTTON_HOVER[variant] : "";
  return `${BASE} ${BUTTON_VARIANTS[variant]} ${hoverClass}`;
}

// Trailing icons say where a button goes, and nudge that way on hover:
//   next:     another page on this site (→)
//   down:     further down this page (↓)
//   external: leaves the site, opens in a new tab (↗)
const ICONS = { next: FiArrowRight, down: FiArrowDown, external: FiArrowUpRight };
const NUDGE = {
  next: "motion-safe:group-hover/btn:translate-x-0.5",
  down: "motion-safe:group-hover/btn:translate-y-0.5",
  external: "motion-safe:group-hover/btn:-translate-y-0.5 motion-safe:group-hover/btn:translate-x-0.5",
};
// Whole-card mode: the card's hover moves the arrow. Written out in full so
// Tailwind can find the classes.
const NUDGE_CARD = {
  next: "motion-safe:group-hover:translate-x-0.5",
  down: "motion-safe:group-hover:translate-y-0.5",
  external: "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5",
};

export function ButtonIcon({ type, cardHover = false }) {
  const Icon = ICONS[type];
  if (!Icon) return null;
  const nudge = (cardHover ? NUDGE_CARD : NUDGE)[type];
  return (
    <Icon
      aria-hidden="true"
      className={`h-[18px] w-[18px] shrink-0 motion-safe:transition-transform duration-150 ${EASE_OUT} ${nudge}`}
    />
  );
}
