"use client";

import { useSyncExternalStore } from "react";

/**
 * The visitor's partner: the Charmander on the Game Boy, which levels up as
 * they explore and evolves like in the game (Charmeleon at Lv16, Charizard at
 * Lv36), and which they can nickname from the Pokédex palette.
 *
 * State lives in localStorage under "partner": { nick, exp, done, shown }.
 * `exp` is earned once per event id (`done`): first visit to a page, opening
 * the Pokédex, opening the Game Boy menu, finding an egg. Level = 5 + exp.
 * `shown` is the stage currently drawn; it lags the stage the level earns
 * until the hero has played the evolution (components/gameboy/Evolution.js),
 * so an evolution earned on the 404 page still happens on screen.
 *
 * The inline script in src/app/layout.js mirrors `shown` to
 * `data-partner` on <html> before first paint (CSS picks the sprite by it),
 * and sets `data-partner-custom` once anything differs from the baked
 * "CHARMANDER Lv5", which hides that baked text so the live one can replace it.
 */
export const STORAGE_KEY = "partner";
export const BASE_LEVEL = 5;
export const MAX_LEVEL = 99;
export const EVOLVE_AT = [0, 16, 36]; // level each stage needs
export const EXP = { visit: 3, pokedex: 2, menu: 2, egg: 8 };
export const NICK_MAX = 10;
export const NICK_PATTERN = /[^A-Z0-9 .\-'!?]/g;

const EVENT = "partner-change";
const NONE = Object.freeze({
  nick: "",
  exp: 0,
  done: Object.freeze([]),
  shown: 0,
});
let cache = { raw: null, state: NONE };

export const levelOf = (exp) => Math.min(MAX_LEVEL, BASE_LEVEL + exp);
export const stageOf = (level) =>
  level >= EVOLVE_AT[2] ? 2 : level >= EVOLVE_AT[1] ? 1 : 0;
export const cleanNick = (text) =>
  text.toUpperCase().replace(NICK_PATTERN, "").slice(0, NICK_MAX).trim();

function read() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return NONE;
  }
  if (raw === cache.raw) return cache.state;
  let state = NONE;
  try {
    const p = JSON.parse(raw);
    if (p && typeof p === "object")
      state = {
        nick: typeof p.nick === "string" ? cleanNick(p.nick) : "",
        exp: Number.isFinite(p.exp) ? Math.max(0, p.exp | 0) : 0,
        done: Array.isArray(p.done)
          ? p.done.filter((d) => typeof d === "string")
          : [],
        shown: [0, 1, 2].includes(p.shown) ? p.shown : 0,
      };
  } catch {
    // Not ours.
  }
  cache = { raw, state };
  return state;
}

/** Keep <html> in step with the stored state (what the inline script does before hydration). */
export function applyToHtml(state = read()) {
  const d = document.documentElement;
  d.dataset.partner = String(state.shown);
  if (state.shown || state.nick || state.exp) d.dataset.partnerCustom = "";
  else delete d.dataset.partnerCustom;
}

function write(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return false; // Storage blocked: the partner stays as it is.
  }
  applyToHtml(next);
  window.dispatchEvent(new Event(EVENT));
  return true;
}

/** Award `points` for `id` once. Returns true the first time. */
export function gainExp(id, points) {
  const s = read();
  if (s.done.includes(id)) return false;
  return write({ ...s, exp: s.exp + points, done: [...s.done, id] });
}

export function setNickname(text) {
  const s = read();
  return write({ ...s, nick: cleanNick(text) });
}

/** The hero calls this at the end of the evolution sequence. */
export function commitStage(stage) {
  const s = read();
  if (s.shown === stage) return;
  write({ ...s, shown: stage });
}

export const partner = () => read();

function subscribe(fn) {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}
const getServerSnapshot = () => NONE;

/**
 * { nick, exp, done, shown, level, stage, custom }. `stage` is what the level
 * earns, `shown` what is drawn; they differ while an evolution is pending.
 * The default (Charmander, Lv5) on the server and before hydration.
 */
export function usePartner() {
  const s = useSyncExternalStore(subscribe, read, getServerSnapshot);
  const level = levelOf(s.exp);
  return {
    ...s,
    level,
    stage: stageOf(level),
    custom: !!(s.shown || s.nick || s.exp),
  };
}
