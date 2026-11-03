"use client";

import { useEffect, useRef, useState } from "react";
import { toggleShiny, useShiny } from "@/app/lib/shiny";

// ↑ ↑ ↓ ↓ ← → ← → B A, typed anywhere on the site (not inside a text field).
const KONAMI = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

const isEditable = (el) =>
  !!el &&
  (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/**
 * Site-wide Konami listener for shiny mode, plus a live region so screen
 * readers hear the toggle (the only other feedback is the palette change).
 * Rendered once from src/app/layout.js.
 */
export default function ShinyMode() {
  const shiny = useShiny();
  const progress = useRef(0);
  const [announce, setAnnounce] = useState("");
  const seen = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditable(event.target)
      )
        return;
      const key = event.key.toLowerCase();
      progress.current =
        key === KONAMI[progress.current]
          ? progress.current + 1
          : key === KONAMI[0]
            ? 1
            : 0;
      if (progress.current < KONAMI.length) return;
      progress.current = 0;
      // Capture phase + preventDefault: the final "A" must not also open the Game Boy menu.
      event.preventDefault();
      toggleShiny();
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, []);

  // Announce changes only (not the initial state on mount).
  useEffect(() => {
    if (shiny === null) return;
    if (seen.current !== null && seen.current !== shiny) {
      setAnnounce(shiny ? "Shiny mode on" : "Shiny mode off");
    }
    seen.current = shiny;
  }, [shiny]);

  return (
    <div aria-live="polite" className="sr-only">
      {announce}
    </div>
  );
}
