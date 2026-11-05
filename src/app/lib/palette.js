"use client";

import { useSyncExternalStore } from "react";

/**
 * Open/closed state of the Pokédex command palette (components/palette/
 * CommandPalette.js), as a tiny external store so anything can open it: the
 * ⌘K shortcut, the nav button, the Game Boy menu's POKéDEX item, or
 * `pokedex.open()` in the console.
 */
let open = false;
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn();
}

export function openPalette() {
  if (open) return;
  open = true;
  emit();
}

export function closePalette() {
  if (!open) return;
  open = false;
  emit();
}

export function togglePalette() {
  open = !open;
  emit();
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
const getSnapshot = () => open;
const getServerSnapshot = () => false;

export function usePaletteOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
