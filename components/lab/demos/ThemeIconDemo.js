"use client";
import { useState } from "react";
import { BsMoonFill } from "react-icons/bs";
import { IconSwap, SunIcon } from "../../nav/icons";
import { demoButtonClass } from "./demoButton";

// The theme toggle's icon crossfade on local state only: it never touches
// DarkContext, so the site theme stays as it is. Reduced motion is handled in
// CSS (.icon-swap-* in globals.css).
export default function ThemeIconDemo() {
  const [showSun, setShowSun] = useState(true);
  return (
    <button
      type="button"
      onClick={() => setShowSun((value) => !value)}
      className={demoButtonClass}
    >
      <span className="relative block h-6 w-6">
        <IconSwap
          iconKey={showSun ? "sun" : "moon"}
          angle={90}
        >
          {showSun ? (
            <SunIcon />
          ) : (
            <BsMoonFill size={19} aria-hidden="true" focusable="false" />
          )}
        </IconSwap>
      </span>
      Preview icon swap
    </button>
  );
}
