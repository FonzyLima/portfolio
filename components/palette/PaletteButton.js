"use client";

import { openPalette } from "@/app/lib/palette";
import { iconButtonClass } from "../nav/config";
import { PokeballIcon } from "../nav/icons";

// The nav's Pokédex button: the touch way into the command palette, since
// phones have no ⌘K. 44px icon button like the menu toggle; the Poké Ball
// wobbles once on hover (globals.css), still with reduced motion.
export default function PaletteButton({ className = "" }) {
  return (
    <button
      type="button"
      aria-label="Open Pokédex (search and commands)"
      title="Pokédex (⌘K)"
      onClick={openPalette}
      className={`${iconButtonClass} ${className}`}
    >
      <PokeballIcon />
    </button>
  );
}
