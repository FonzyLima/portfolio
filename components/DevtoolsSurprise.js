"use client";

import { useEffect } from "react";
import { isShiny, toggleShiny } from "@/app/lib/shiny";
import { markEgg } from "@/app/lib/eggs";
import { openPalette } from "@/app/lib/palette";
import { STAGE_NAMES, STAGE_SLUGS } from "./gameboy/partnerArt";
import { levelOf, partner } from "@/app/lib/partner";
import { experiences, profile, socials } from "@/app/data/portfolioData";

/**
 * DevTools easter egg. Anyone who opens the console finds a wild Charmander,
 * a trainer-tip list, and a `pokedex` global with a few commands. Logged once
 * after idle; the sprite is fetched from /public so nothing lands in the bundle.
 * Regenerate the sprite with `node scripts/console-sprite.mjs`.
 */
// One sprite per stage (scripts/partner-art.mjs writes the evolutions).
const spriteUrl = (stage) => `/gameboy/${STAGE_SLUGS[stage]}-console.svg`;

// Same recolours as `.shiny` in src/app/globals.css (the console can't use CSS).
const SHINY_FILLS = {
  "#E98E3D": "#f2c94c",
  "#E5BB52": "#fbf0c0",
  "#D33C30": "#c98a1e",
  "#E9D98E": "#fff8d6",
  "#D9553A": "#e8b93a",
  "#BB2B29": "#b57a16",
  "#F26B52": "#f5d46a",
  "#F9A98A": "#fdeab0",
};
// Shiny Charizard is black, not gold.
const SHINY_FILLS_CHARIZARD = {
  ...SHINY_FILLS,
  "#E98E3D": "#3a3a3a",
  "#F2A94E": "#4f4f4f",
  "#D1631F": "#232323",
  "#8E3A10": "#111111",
  "#E5BB52": "#9b6bd6",
};

// DevTools has its own light/dark theme, so only the badge sets colours:
// accent (#61BC7A) under on-accent (#171717) reads on both.
const MONO = "font-family:ui-monospace,Menlo,Consolas,monospace";
const BADGE = `${MONO};font-weight:700;letter-spacing:.06em;color:#171717;background:#61BC7A;padding:3px 8px;border-radius:4px`;
const LABEL = `${MONO};font-weight:700`;
const PLAIN = MONO;

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/** "August 2023 - September 2024" -> Date of the start month. */
function startOf(period) {
  const [month, year] = period.split(" - ")[0].split(" ");
  return new Date(Number(year), MONTHS.indexOf(month.toLowerCase()), 1);
}

/** Months since the first job, as "3y 2m" (matches the trainer card). */
function timePlayed() {
  const first = new Date(
    Math.min(...experiences.map((e) => startOf(e.period).getTime())),
  );
  const now = new Date();
  const months =
    (now.getFullYear() - first.getFullYear()) * 12 +
    now.getMonth() -
    first.getMonth();
  return `${Math.floor(months / 12)}y ${months % 12}m`;
}

/** The footer counter's answer for this session (components/footer/VisitorCounter.js). */
function trainersMet() {
  try {
    const total = JSON.parse(sessionStorage.getItem("visit"))?.total;
    return typeof total === "number" ? total.toLocaleString("en-US") : "?";
  } catch {
    return "?";
  }
}

const social = (label) => socials.find((s) => s.label === label)?.href;
const firstName = () => profile.name.split(" ")[0].toUpperCase();
/** "SPARKY (CHARMELEON) Lv18", or "CHARMANDER Lv5". */
function partnerLine() {
  const p = partner();
  const species = STAGE_NAMES[p.shown];
  return `${p.nick ? `${p.nick} (${species})` : species} Lv${levelOf(p.exp)}`;
}

function makePokedex() {
  return {
    help() {
      markEgg("console");
      console.log(
        `%cPOKéDEX%c\n` +
          `  pokedex.shiny()    toggle shiny mode (also: Konami code, or poke Charmander ×10)\n` +
          `  pokedex.trainer()  trainer card\n` +
          `  pokedex.catch()    throw a Poké Ball\n` +
          `  pokedex.open()     open the Pokédex (⌘K)\n` +
          `  pokedex.partner()  your partner's stage and level\n` +
          `  pokedex.help()     this list`,
        BADGE,
        PLAIN,
      );
      return "▶";
    },
    open() {
      openPalette();
      return "▶";
    },
    shiny() {
      return toggleShiny() ? "✨ Shiny mode on" : "Shiny mode off";
    },
    partner() {
      const p = partner();
      const level = levelOf(p.exp);
      const next = level < 16 ? 16 : level < 36 ? 36 : null;
      console.log(
        `%c${partnerLine()}%c  ${next ? `evolves at Lv${next}: explore the site and find eggs` : "fully evolved"}`,
        BADGE,
        PLAIN,
      );
      return "▶";
    },
    trainer() {
      console.table({
        Name: profile.name,
        Class: profile.title,
        Hometown: profile.location,
        Badges: `${experiences.length} (${experiences.map((e) => e.company).join(", ")})`,
        "Time played": timePlayed(),
        "Trainers met": trainersMet(),
        Partner: partnerLine(),
      });
      return "▶";
    },
    catch() {
      const say = (text, delay) =>
        setTimeout(() => console.log(`%c${text}`, PLAIN), delay);
      say("You used POKé BALL!", 0);
      say(". . .", 700);
      say(". . . . . .", 1400);
      setTimeout(() => {
        console.log(`%cGotcha! ${firstName()} was caught!`, BADGE);
        console.log(
          `%cEmail%c     ${profile.email}\n%cGitHub%c    ${social("GitHub")}\n%cLinkedIn%c  ${social("LinkedIn")}`,
          LABEL,
          PLAIN,
          LABEL,
          PLAIN,
          LABEL,
          PLAIN,
        );
      }, 2200);
      return "▶";
    },
  };
}

async function spriteStyle() {
  try {
    const stage = partner().shown;
    const res = await fetch(spriteUrl(stage));
    if (!res.ok) return null;
    let svg = await res.text();
    if (isShiny()) {
      const fills = stage === 2 ? SHINY_FILLS_CHARIZARD : SHINY_FILLS;
      for (const [from, to] of Object.entries(fills))
        svg = svg.replaceAll(from, to);
    }
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    // A 1px-font blank with padding: the padding box is the picture.
    return `font-size:1px;line-height:0;padding:62px 63px;background:url("${url}") center/contain no-repeat`;
  } catch {
    return null; // Offline or blocked: the text still prints.
  }
}

async function greet() {
  const sprite = await spriteStyle();
  if (sprite) console.log("%c ", sprite);
  console.log(
    `%cA wild ${firstName()} appeared!%c  ${profile.title} · ${profile.location.split(",")[0]}`,
    BADGE,
    PLAIN,
  );
  console.log(
    `%cTrainer tips%c\n` +
      `  ↑ ↑ ↓ ↓ ← → ← → B A   shiny mode\n` +
      `  poke your partner ×10 also shiny mode\n` +
      `  pokedex.help()        everything else`,
    LABEL,
    PLAIN,
  );
}

export default function DevtoolsSurprise() {
  useEffect(() => {
    // Greet once per page. No cleanup on purpose: Strict Mode runs the effect
    // twice, and cancelling the idle callback in between would skip the greeting.
    if (window.pokedex) return;
    window.pokedex = makePokedex();
    if ("requestIdleCallback" in window)
      requestIdleCallback(greet, { timeout: 3000 });
    else setTimeout(greet, 1500);
  }, []);
  return null;
}
