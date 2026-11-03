import React, { useContext } from "react";
import { BsMoonFill } from "react-icons/bs";
import DarkContext from "@/app/context/darkContext";
import { socials } from "@/app/data/portfolioData";
import LogoMark from "../LogoMark";
import { IconSwap, SunIcon } from "./icons";
import { indicatorClass } from "./motion";
import { focusRing, iconButtonClass } from "./config";

// Pieces shared by the site nav (components/Navigation.js) and the lab's
// preview nav (./NavigationLab.js).

// Link label plus its current-page marker (default: the underline). On
// desktop (`markerFor` set) every link has a marker, hidden unless active,
// so useMarkerSlide can slide it between links. In the mobile menus it's
// static and only the active link has one. `behind`: the marker sits behind
// the text (the lab's pill), so the text gets its own stacking layer.
export function LinkLabel({ label, isActive, markerFor, markerClass = indicatorClass, behind = false }) {
  const marker = markerFor ? (
    <span
      aria-hidden="true"
      data-marker={markerFor}
      className={`${markerClass} origin-left ${isActive ? "" : "invisible"}`}
    />
  ) : isActive ? (
    <span aria-hidden="true" className={markerClass} />
  ) : null;
  return behind ? (
    <span className="relative">
      {marker}
      <span className="relative">{label}</span>
    </span>
  ) : (
    <span className="relative">
      {label}
      {marker}
    </span>
  );
}

export function LogoContent() {
  return (
    <>
      <LogoMark className="h-6 w-6 shrink-0 lg:h-8 lg:w-8" />
      <span>
        <span className="font-medium">Alfonso</span>{" "}
        <span className="text-fg-muted">Lima</span>
      </span>
    </>
  );
}

// Socials, so phone visitors can reach out without scrolling to the footer.
// Staggers in after the page links.
export function MenuSocials() {
  return (
    <ul aria-label="Social links" className="-mx-2 flex flex-wrap">
      {socials.map(({ label, href }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-[44px] items-center px-2 type-small text-fg-muted hover:text-fg ${focusRing} focus-visible:outline-offset-[-6px]`}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ThemeButton({ placement = "md:ml-2 md:-mr-[11px]" }) {
  const [isDark, setisDark] = useContext(DarkContext);
  return (
    <button
      type="button"
      aria-label={
        isDark === null
          ? "Switch theme"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      className={`${iconButtonClass} ${placement}`}
      onClick={() => setisDark((dark) => !dark)}
    >
      {isDark === null ? (
        // Before hydration the theme is only known to CSS, so the
        // `dark` class picks the icon. No animation on this swap.
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="hidden dark:contents">
            <SunIcon />
          </span>
          <span className="contents dark:hidden">
            <BsMoonFill size={19} aria-hidden="true" focusable="false" />
          </span>
        </span>
      ) : (
        <IconSwap iconKey={isDark ? "sun" : "moon"} angle={90}>
          {isDark ? (
            <SunIcon />
          ) : (
            <BsMoonFill size={19} aria-hidden="true" focusable="false" />
          )}
        </IconSwap>
      )}
    </button>
  );
}
