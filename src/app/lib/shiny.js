"use client";

import { useSyncExternalStore } from "react";
import { markEgg } from "./eggs";

/**
 * Shiny mode: the easter-egg palette (gold instead of green, and a shiny
 * Charmander). It lives as the `shiny` class on <html>, next to `dark`, and the
 * token overrides are in src/app/globals.css. The inline script in
 * src/app/layout.js restores it before first paint. Toggled by the Konami code
 * (components/ShinyMode.js) or by poking Charmander ten times (GameboyHero).
 */
export const SHINY_STORAGE_KEY = "shiny";

export function isShiny() {
  return document.documentElement.classList.contains("shiny");
}

export function setShiny(on) {
  document.documentElement.classList.toggle("shiny", on);
  if (on) markEgg("shiny");
  try {
    if (on) localStorage.setItem(SHINY_STORAGE_KEY, "1");
    else localStorage.removeItem(SHINY_STORAGE_KEY);
  } catch {
    // Storage blocked: shiny lasts this page view.
  }
}

export function toggleShiny() {
  const next = !isShiny();
  setShiny(next);
  return next;
}

function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}
const getServerSnapshot = () => null;

/** `true`/`false` after mount, `null` during SSR and hydration. */
export function useShiny() {
  return useSyncExternalStore(subscribe, isShiny, getServerSnapshot);
}
