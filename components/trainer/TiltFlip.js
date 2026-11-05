"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { usePointerTilt } from "./usePointerTilt";

// Client leaves for components/TrainerCard.js, which is otherwise a Server
// Component. The card faces (icons included) are rendered on the server and
// passed in as children, so no icon code ships to the browser.

/* ---------- tilt ---------- */

// Mouse-driven tilt. Writes --rx/--ry (rotation) on the element and --mx/--my
// (pointer position in %) and --sheen (0/1) on its `[data-tilt-sheen]`
// descendants only, so the moving glare doesn't restyle the whole card.
// Mouse only; does nothing for touch or when the visitor prefers reduced
// motion. CSS variables written once per frame, no re-renders (see
// ./usePointerTilt).
const setSheen = (sheens, x, y, on) => {
  for (const sheen of sheens) {
    if (on) {
      sheen.style.setProperty("--mx", `${x * 100}%`);
      sheen.style.setProperty("--my", `${y * 100}%`);
    }
    sheen.style.setProperty("--sheen", on ? "1" : "0");
  }
};

// The tilting element; other props (className) pass through.
export function Tilt({ maxDeg = 10, children, ...props }) {
  const sheens = useRef([]);
  const handlers = usePointerTilt({
    start: (el) => {
      sheens.current = el.querySelectorAll("[data-tilt-sheen]");
    },
    apply: (el, x, y) => {
      el.style.setProperty("--ry", `${(x - 0.5) * maxDeg}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * maxDeg}deg`);
      setSheen(sheens.current, x, y, true);
    },
    reset: (el) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      setSheen(sheens.current, 0, 0, false);
    },
  });
  return (
    <div {...props} {...handlers}>
      {children}
    </div>
  );
}

/* ---------- flip ---------- */

const FlipContext = createContext([false, () => {}]);

// The card's outer element (other props pass through). Holds the flipped
// state for the FlipInner/FlipFace/FlipButton inside it.
export function FlipRoot({ children, ...props }) {
  const state = useState(false);
  return (
    <FlipContext.Provider value={state}>
      <div {...props}>{children}</div>
    </FlipContext.Provider>
  );
}

// The rotating element: `flippedClassName` is added while flipped. Flipping
// is the FlipButton's job only, so clicks and text selection on the faces
// (e.g. the scrollable badge list) never turn the card.
export function FlipInner({ className = "", flippedClassName = "", children }) {
  const [flipped] = useContext(FlipContext);
  return <div className={`${className} ${flipped ? flippedClassName : ""}`}>{children}</div>;
}

// One face. The face that's turned away is `inert`; with `hideWhenInactive`
// it's also aria-hidden. `as` picks the tag; other props pass through.
export function FlipFace({ as: Tag = "div", side = "front", hideWhenInactive = false, children, ...props }) {
  const [flipped] = useContext(FlipContext);
  const inactive = side === "front" ? flipped : !flipped;
  return (
    <Tag {...props} inert={inactive} aria-hidden={hideWhenInactive ? inactive : undefined}>
      {children}
    </Tag>
  );
}

// Flip toggle. Shows `flippedLabel` (defaults to `label`) while flipped, after
// an optional server-rendered `icon`. No aria-pressed: the label already says
// what the button will do, and "Flip back, pressed" reads as nonsense.
export function FlipButton({ className = "", label, flippedLabel = label, icon = null }) {
  const [flipped, setFlipped] = useContext(FlipContext);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className={className}
    >
      {icon}
      {flipped ? flippedLabel : label}
    </button>
  );
}
