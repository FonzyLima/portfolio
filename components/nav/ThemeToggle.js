"use client";
import { useContext } from "react";
import DarkContext from "@/app/context/darkContext";
import { BsMoonFill } from "react-icons/bs";
import { SunIcon } from "./icons";

// The nav's light/dark toggle (components/Navigation.js): two buttons, Light
// and Dark, with a thumb that slides behind the current one.
//
// It draws its state from the `dark` class on <html> (`dark:` transform and
// opacity utilities, plus .theme-slide / .theme-fade in globals.css), never
// from React state. So it's right before hydration (the inline script sets
// the class before first paint) and it animates on its own whenever the
// class flips, whoever flips it. `isDark` (null until mounted) only feeds the
// ARIA state. Motion is 240ms ease-in-out, and instant with reduced motion.
export function SegmentedThemeToggle({ className = "" }) {
  const [isDark, setDark] = useContext(DarkContext);
  // Round focus rings, drawn just inside each 44px segment.
  const segment =
    "relative z-10 flex h-11 w-11 items-center justify-center rounded-full theme-fade focus-visible:outline-offset-[-2px]";
  return (
    <div
      role="group"
      aria-label="Theme"
      className={`relative flex shrink-0 rounded-full bg-fg/10 flex-row ${className}`}
    >
      <span
        aria-hidden="true"
        className="theme-slide pointer-events-none absolute left-1 top-1 h-9 w-9 rounded-full bg-surface-raised shadow-1 dark:translate-x-11"
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
        <BsMoonFill size={19} aria-hidden="true" focusable="false" />
      </button>
    </div>
  );
}
