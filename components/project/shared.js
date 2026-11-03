import React from "react";
import { FiLock } from "react-icons/fi";

// Pieces shared by the shipping card (components/Project.js) and the
// lab-only parts split out of it (OriginalCard.js, IconLinks.js), which are
// loaded on demand so public pages don't ship them.

export const SIZES =
  "(min-width: 1120px) 512px, (min-width: 768px) calc(50vw - 36px), calc(100vw - 48px)";

export const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

// "Lift": rise 4px and take the floating shadow, on hover or keyboard focus.
const LIFT = `motion-safe:transition-[transform,box-shadow] duration-200 ${EASE_OUT} [@media(hover:hover)]:hover:shadow-2 focus-within:shadow-2 motion-safe:[@media(hover:hover)]:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1`;

// "Outline": a 2px accent ring a few px outside the card on hover (pointer
// devices only). Keyboard focus already gets the global focus ring.
const OUTLINE = "outline outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-150 [@media(hover:hover)]:hover:outline-accent-strong";

export const hoverClass = (hover) =>
  hover === "lift" ? LIFT : hover === "outline" ? OUTLINE : "";

// "Zoom" for the Original card: the image scales up a little inside its frame.
export const ZOOM = `motion-safe:transition-transform motion-safe:duration-[240ms] ${EASE_OUT} motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-within:scale-[1.04]`;

// What the main link does, in words. The live link's destination depends on
// the kind of project; without one, the main action is the code itself.
export function primaryAction(category, link) {
  if (!link) return { label: "View code", icon: "git" };
  if (category === "Game") return { label: "Play", icon: "arrow" };
  if (category === "Mobile App") return { label: "Get the app", icon: "arrow" };
  return { label: "Visit site", icon: "arrow" };
}

export function PrivateNote() {
  return (
    <span className="inline-flex min-h-[44px] items-center gap-2 type-small text-fg-muted">
      <FiLock aria-hidden="true" className="h-4 w-4" />
      Private project, no public link
    </span>
  );
}
