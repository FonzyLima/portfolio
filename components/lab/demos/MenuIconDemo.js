"use client";
import { useState } from "react";
import { MenuIcon } from "../../nav/icons";
import { demoButtonClass } from "./demoButton";

// The nav's mobile menu icon, toggled locally. It doesn't open any menu.
// Reduced motion is handled in CSS (.menu-line-* in globals.css).
export default function MenuIconDemo() {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={open}
      onClick={() => setOpen((value) => !value)}
      className={demoButtonClass}
    >
      <MenuIcon open={open} />
      Morph menu icon
    </button>
  );
}
