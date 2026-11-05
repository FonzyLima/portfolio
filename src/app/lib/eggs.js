"use client";

import { useSyncExternalStore } from "react";
import { EXP, gainExp } from "./partner";

/**
 * Which easter eggs this visitor has found, in localStorage under "eggs".
 * Marked where each egg fires (shiny.js, the 404 page, the console pokedex).
 * The Pokédex palette lists every egg like Pokédex entries: found ones by
 * name with a Poké Ball mark, the rest as "?????", so the count teases
 * without spoiling how to find them.
 */
export const STORAGE_KEY = "eggs";
export const EGGS = {
  shiny: "Shiny mode",
  encounter: "Wild encounter",
  console: "Console Pokédex",
};
export const EGG_COUNT = Object.keys(EGGS).length;

const EVENT = "eggs-change";
const NONE = Object.freeze([]);
let cache = { raw: null, list: NONE };

function read() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return NONE;
  }
  if (raw === cache.raw) return cache.list;
  let list = NONE;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) list = parsed.filter((id) => id in EGGS);
  } catch {
    // Not ours: treat as none found.
  }
  cache = { raw, list };
  return list;
}

export const foundEggs = () => read();

export function markEgg(id) {
  if (!(id in EGGS) || read().includes(id)) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...read(), id]));
  } catch {
    return; // Storage blocked: nothing to remember.
  }
  window.dispatchEvent(new Event(EVENT));
  gainExp(`egg:${id}`, EXP.egg); // every egg is a big step towards evolving
}

function subscribe(fn) {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}
const getServerSnapshot = () => NONE;

/** Found egg ids; `[]` on the server and before hydration. */
export function useFoundEggs() {
  return useSyncExternalStore(subscribe, read, getServerSnapshot);
}
