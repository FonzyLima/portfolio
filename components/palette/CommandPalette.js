"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import DarkContext from "@/app/context/darkContext";
import { profile, socials } from "@/app/data/portfolioData";
import { EGGS, EGG_COUNT, useFoundEggs } from "@/app/lib/eggs";
import { closePalette, togglePalette, usePaletteOpen } from "@/app/lib/palette";
import {
  EVOLVE_AT,
  EXP,
  NICK_MAX,
  cleanNick,
  gainExp,
  setNickname,
  usePartner,
} from "@/app/lib/partner";
import { STAGE_NAMES } from "../gameboy/partnerArt";
import { scrollToAnchor } from "@/app/lib/scrollToAnchor";
import { isShiny, toggleShiny, useShiny } from "@/app/lib/shiny";
import PixelText from "../PixelText";

/**
 * The Pokédex: a site-wide command palette. ⌘K / Ctrl+K, the nav's Pokédex
 * button, the Game Boy menu's POKéDEX item or `pokedex.open()` in the console
 * open it. It is drawn like a FireRed menu box (two-tone frame, pixel-font
 * headers, ▶ cursor) but it is a normal dialog with a combobox: typing filters
 * pages, projects (fetched from /api/projects on first open) and actions;
 * arrows move the cursor, Enter selects, Escape closes. Every row has a fixed
 * Pokédex number ("No.001"), assigned over the full list so filtering keeps
 * them. The "Easter eggs" group lists every egg: found ones by name with a
 * Poké Ball mark, unfound ones as "?????" (src/app/lib/eggs.js). The first
 * group is the partner (src/app/lib/partner.js): its name, stage and level,
 * and a "nickname" action that turns the input into a name entry.
 *
 * The dialog mounts fresh on every open, so its state (query, cursor) resets.
 */

const LIST_ID = "pokedex-list";
const optionId = (i) => `pokedex-option-${i}`;
const entryNo = (no) => `No.${String(no).padStart(3, "0")}`;

// Pages and anchors. Contact scrolls to the footer, which every page has.
const PAGES = [
  { label: "Home", hint: "Game Boy", href: "/", keywords: "start" },
  {
    label: "Projects",
    hint: "All work",
    href: "/projects",
    keywords: "work portfolio",
  },
  {
    label: "About",
    hint: "Trainer card",
    href: "/about",
    keywords: "trainer card bio",
  },
  {
    label: "Skills",
    hint: "Tech stack",
    href: "/about#technical-skills",
    keywords: "stack tech",
  },
  {
    label: "Experience",
    hint: "Résumé",
    href: "/about#resume",
    keywords: "resume cv jobs badges",
  },
  {
    label: "Contact",
    hint: "Footer",
    anchor: "#footer",
    keywords: "email hire talk",
  },
];

// Lowercase substring beats a scattered subsequence; a prefix beats both.
function score(query, text) {
  const t = text.toLowerCase();
  if (!query) return 1;
  if (t.startsWith(query)) return 4;
  const at = t.indexOf(query);
  if (at >= 0) return t[at - 1] === " " ? 3 : 2;
  let i = 0;
  for (const ch of t) if (ch === query[i]) i++;
  return i === query.length ? 1 : 0;
}

let projectsCache = null;
async function loadProjects() {
  if (projectsCache) return projectsCache;
  const res = await fetch("/api/projects");
  if (!res.ok) throw new Error(`/api/projects -> ${res.status}`);
  const data = await res.json();
  projectsCache = (data.projects ?? []).map((p) => ({
    label: p.name,
    hint: p.category || "Project",
    href: p.link || p.git || "/projects",
    external: !!(p.link || p.git),
    keywords: [p.category, ...(p.tools ?? [])].filter(Boolean).join(" "),
  }));
  return projectsCache;
}

// The ▶ cursor from the Game Boy menu, 4 pixels wide, as an inline SVG.
const CURSOR_D = [1, 2, 3, 4, 3, 2, 1]
  .map((w, r) => `M0 ${r * 2}h${w * 2}v2h-${w * 2}z`)
  .join("");
function Cursor({ className = "" }) {
  return (
    <svg
      viewBox="0 0 8 14"
      width="8"
      height="14"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={className}
    >
      <path d={CURSOR_D} fill="currentColor" />
    </svg>
  );
}

// The Pokédex's "caught" mark, on found easter eggs: a 12px Poké Ball.
function BallMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`shrink-0 text-accent-strong ${className}`}
    >
      <circle cx="6" cy="6" r="5" />
      <path d="M1 6h3M8 6h3" />
      <circle cx="6" cy="6" r="1.5" />
    </svg>
  );
}

function Kbd({ children }) {
  return (
    <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-custom text-[12px] text-fg-muted">
      {children}
    </kbd>
  );
}

export default function CommandPalette() {
  const open = usePaletteOpen();

  // ⌘K / Ctrl+K anywhere toggles the palette.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        togglePalette();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return open ? <PaletteDialog /> : null;
}

function PaletteDialog() {
  const router = useRouter();
  const [isDark, setDark] = useContext(DarkContext);
  const shiny = useShiny();
  const eggs = useFoundEggs();
  const partner = usePartner();
  const [query, setQuery] = useState("");
  const [naming, setNaming] = useState(false); // the input is a nickname entry
  const [selected, setSelected] = useState(0);
  const [projects, setProjects] = useState(null); // null loading, [] none/failed
  const [notice, setNotice] = useState("");
  const [closing, setClosing] = useState(false);
  const inputRef = useRef(null);
  const closeRef = useRef(null);
  const listRef = useRef(null);
  const opener = useRef(null);

  // On mount: remember the opener, focus the input, lock scroll, load projects.
  // The opener is only taken once: under Strict Mode the effect runs twice,
  // and by the second run the active element is this dialog's own input,
  // which is gone by the time focus should go back.
  useEffect(() => {
    if (!opener.current) opener.current = document.activeElement;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    inputRef.current?.focus({ preventScroll: true });
    loadProjects().then(setProjects, () => setProjects([]));
    gainExp("pokedex", EXP.pokedex);
    return () => {
      root.style.overflow = prevOverflow;
    };
  }, []);

  // Live-region notices clear themselves.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Closing: play the exit, then the store flips and focus goes back to the opener.
  const finishClose = () => {
    closePalette();
    const el = opener.current;
    if (el && document.contains(el)) el.focus({ preventScroll: true });
  };
  const requestClose = () => {
    if (closing) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) finishClose();
    else setClosing(true);
  };

  const species = STAGE_NAMES[partner.shown];
  const nextLevel = EVOLVE_AT.find((lv) => lv > partner.level);
  const partnerItems = useMemo(
    () => [
      {
        label: `${partner.nick || species} Lv${partner.level}`,
        hint: partner.nick
          ? species
          : nextLevel
            ? `Evolves at Lv${nextLevel}`
            : "Fully evolved",
        href: "/",
        keywords: `partner pokemon charmander ${species.toLowerCase()} level`,
      },
      {
        label: partner.nick ? "Change nickname" : "Give a nickname",
        hint: "Partner",
        keywords: "name rename partner",
        run: () => {
          setNaming(true);
          setQuery(partner.nick);
        },
        stay: true,
      },
    ],
    [partner.nick, partner.level, species, nextLevel],
  );

  const actions = useMemo(
    () => [
      {
        label: isDark ? "Switch to light mode" : "Switch to dark mode",
        hint: "Theme",
        keywords: "theme dark light toggle",
        run: () => setDark((d) => !d),
        stay: true,
      },
      {
        label: "Copy email address",
        hint: "Clipboard",
        keywords: "contact mail clipboard",
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setNotice("Email address copied");
          } catch {
            setNotice(`Couldn't copy. The address is ${profile.email}`);
          }
        },
        stay: true,
      },
      {
        label: "Send an email",
        hint: "Mail",
        href: `mailto:${profile.email}`,
        keywords: "contact hire",
      },
      ...socials.map((s) => ({
        label: `Open ${s.label}`,
        hint: "Profile",
        href: s.href,
        external: true,
        keywords: "social profile",
      })),
    ],
    [isDark, setDark],
  );

  // Every egg, in EGGS order, like Pokédex entries: unfound ones are locked
  // rows ("?????") that can't be selected and never match a query.
  const eggItems = useMemo(() => {
    const found = {
      shiny: {
        label: shiny ? "Shiny mode: on" : "Shiny mode: off",
        hint: "Toggle",
        keywords: "gold konami easter egg",
        run: () => {
          toggleShiny();
          setNotice(isShiny() ? "Shiny mode on" : "Shiny mode off");
        },
        stay: true,
      },
      encounter: {
        label: "Wild encounter",
        hint: "404 page",
        href: "/tall-grass",
        keywords: "404 lost easter egg",
      },
      console: {
        label: "Console Pokédex",
        hint: "DevTools",
        keywords: "devtools easter egg",
        run: () => {
          window.pokedex?.help();
          setNotice("Check the browser console");
        },
        stay: true,
      },
    };
    return Object.keys(EGGS).map((id) =>
      eggs.includes(id)
        ? { ...found[id], egg: true }
        : { label: "?????", hint: "Not found yet", locked: true },
    );
  }, [eggs, shiny]);

  // Filtered and grouped. Numbers are assigned over the whole unfiltered list
  // (pages, projects, actions, eggs) so an entry keeps its "No." while
  // filtering, like a real Pokédex. Every selectable row also carries its
  // index in `flat`, which is what the cursor moves through; locked rows
  // (unfound eggs) are shown but not in `flat`, and only with an empty query.
  const { groups, flat } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const number = (items, from) =>
      items.map((item, k) => ({ ...item, no: from + k + 1 }));
    const filter = (items) =>
      items
        .filter((item) => !item.locked || !q)
        .map((item) => ({
          item,
          // Locked rows only exist with an empty query, where everything
          // scores 1, so the sort keeps Pokédex order.
          s: item.locked
            ? 1
            : Math.max(score(q, item.label), score(q, item.keywords ?? "") - 1),
        }))
        .filter(({ s }) => s > 0)
        .sort((a, b) => b.s - a.s)
        .map(({ item }) => item);
    const mine = number(partnerItems, 0);
    const pages = number(PAGES, mine.length);
    const projs = number(projects ?? [], mine.length + pages.length);
    const acts = number(actions, mine.length + pages.length + projs.length);
    const eggRows = number(
      eggItems,
      mine.length + pages.length + projs.length + acts.length,
    );
    const raw = [
      { title: "PARTNER", items: filter(mine) },
      { title: "PAGES", items: filter(pages) },
      {
        title: "PROJECTS",
        items: filter(projs),
        empty: projects === null ? "Loading…" : null,
      },
      { title: "ACTIONS", items: filter(acts) },
      {
        title: "EASTER EGGS",
        count: `${eggs.length}/${EGG_COUNT}`,
        items: filter(eggRows),
      },
    ];
    let next = 0;
    const groups = raw.map((g) => ({
      ...g,
      rows: g.items.map((item) => ({ item, i: item.locked ? -1 : next++ })),
    }));
    return {
      groups,
      flat: groups.flatMap((g) => g.items.filter((item) => !item.locked)),
    };
  }, [query, projects, partnerItems, actions, eggItems, eggs.length]);

  // The cursor stays on a real row as results change.
  const cursor = Math.min(selected, Math.max(0, flat.length - 1));

  useEffect(() => {
    listRef.current
      ?.querySelector(`#${optionId(cursor)}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const activate = (item) => {
    if (!item) return;
    if (item.run) {
      item.run();
      if (!item.stay) requestClose();
      return;
    }
    if (item.anchor) {
      finishClose();
      scrollToAnchor(null, item.anchor);
      return;
    }
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      requestClose();
      return;
    }
    if (item.href.startsWith("mailto:")) {
      window.location.assign(item.href);
      requestClose();
      return;
    }
    finishClose();
    router.push(item.href);
  };

  const saveNickname = () => {
    const nick = cleanNick(query);
    setNickname(nick);
    setNotice(nick ? `Nickname set: ${nick}` : "Nickname cleared");
    setNaming(false);
    setQuery("");
  };
  const stopNaming = () => {
    setNaming(false);
    setQuery("");
  };

  const onKeyDown = (event) => {
    if (naming) {
      if (event.key === "Enter") {
        event.preventDefault();
        saveNickname();
      } else if (event.key === "Escape") {
        event.preventDefault();
        stopNaming();
      } else if (event.key === "Tab") {
        event.preventDefault();
        const next =
          event.target === inputRef.current
            ? closeRef.current
            : inputRef.current;
        next?.focus();
      }
      return;
    }
    const n = flat.length;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (n) setSelected((cursor + 1) % n);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (n) setSelected((cursor - 1 + n) % n);
        break;
      case "Enter":
        event.preventDefault();
        activate(flat[cursor]);
        break;
      case "Escape":
        event.preventDefault();
        requestClose();
        break;
      case "Tab": {
        // Two tab stops, the input and the close button, cycling.
        event.preventDefault();
        const next =
          event.target === inputRef.current
            ? closeRef.current
            : inputRef.current;
        next?.focus();
        break;
      }
      default:
    }
  };

  const nothing =
    flat.length === 0 && !groups.some((g) => g.empty || g.rows.length);

  return (
    <div
      className="fixed inset-0 z-50 font-custom"
      data-closing={closing ? "" : undefined}
    >
      <div
        aria-hidden="true"
        onClick={requestClose}
        className="palette-scrim absolute inset-0 bg-scrim/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokedex-title"
        onKeyDown={onKeyDown}
        onAnimationEnd={(event) => {
          if (closing && event.target === event.currentTarget) finishClose();
        }}
        className="palette-panel absolute left-1/2 top-[8vh] w-[calc(100%-32px)] max-w-[560px] -translate-x-1/2 rounded-lg border-2 border-line-strong bg-surface-raised p-[3px] shadow-2 sm:top-[12vh]"
      >
        {/* FireRed boxes have a second, thinner inner line. */}
        <div className="flex max-h-[min(72vh,600px)] flex-col rounded border border-line">
          <div className="flex items-center justify-between gap-3 border-b border-line pl-4 pr-1">
            <h2
              id="pokedex-title"
              className="flex items-center gap-3 py-3 text-fg"
            >
              <PixelText text={naming ? "NICKNAME?" : "POKéDEX"} px={2.5} />
              <span className="sr-only">
                {naming
                  ? "Nickname your partner"
                  : "Pokédex: search pages, projects and actions"}
              </span>
            </h2>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close Pokédex"
              onClick={requestClose}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-fg hover:text-fg-muted"
            >
              <FiX aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 border-b border-line px-4">
            <Cursor className="shrink-0 text-fg" />
            {naming ? (
              <input
                ref={inputRef}
                type="text"
                aria-label={`Nickname for ${species}, up to ${NICK_MAX} letters. Enter saves, Escape cancels.`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={NICK_MAX}
                placeholder={`${species}'s nickname?`}
                value={query}
                onChange={(event) =>
                  setQuery(
                    cleanNick(event.target.value + " ").slice(0, NICK_MAX),
                  )
                }
                className="min-h-[52px] w-full bg-transparent type-body uppercase tracking-wide text-fg placeholder:normal-case placeholder:tracking-normal placeholder:text-fg-muted focus:outline-none"
              />
            ) : (
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls={LIST_ID}
                aria-activedescendant={
                  flat.length ? optionId(cursor) : undefined
                }
                aria-autocomplete="list"
                aria-label="Search pages, projects and actions"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="What will you do?"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                className="min-h-[52px] w-full bg-transparent type-body text-fg placeholder:text-fg-muted focus:outline-none"
              />
            )}
          </div>

          {naming && (
            <div className="px-4 py-5 type-small text-fg-muted">
              <p className="text-fg">
                Up to {NICK_MAX} letters, numbers or spaces. The name shows on
                the Game Boy and in the console.
              </p>
              <p className="mt-2">
                <Kbd>↵</Kbd> save <span className="mx-2" /> <Kbd>esc</Kbd> back
                {partner.nick && (
                  <>
                    <span className="mx-2" />
                    Save an empty name to go back to {species}.
                  </>
                )}
              </p>
            </div>
          )}
          <div
            ref={listRef}
            id={LIST_ID}
            role="listbox"
            aria-label="Results"
            className="overflow-y-auto py-2"
            hidden={naming}
          >
            {nothing && (
              <p className="px-4 py-6 text-center type-small text-fg-muted">
                Nothing found. It got away!
              </p>
            )}
            {groups.map((group) =>
              group.rows.length || group.empty ? (
                <div
                  key={group.title}
                  role="group"
                  aria-labelledby={`pokedex-${group.title}`}
                >
                  <div
                    id={`pokedex-${group.title}`}
                    className="flex items-center gap-2 px-4 pb-1 pt-3 text-fg-muted"
                  >
                    <PixelText text={group.title} px={1.5} />
                    <span className="sr-only">{group.title.toLowerCase()}</span>
                    {group.count && (
                      <>
                        <PixelText text={group.count} px={1.5} />
                        <span className="sr-only">
                          {group.count.replace("/", " of ")} found
                        </span>
                      </>
                    )}
                  </div>
                  {group.empty && !group.rows.length && (
                    <p className="px-4 py-2 type-small text-fg-muted">
                      {group.empty}
                    </p>
                  )}
                  {group.rows.map(({ item, i }) => {
                    if (item.locked)
                      return (
                        <div
                          key={`locked-${item.no}`}
                          className="flex min-h-[44px] items-center gap-3 px-4 py-2 text-fg-muted"
                        >
                          <Cursor className="invisible shrink-0" />
                          <PixelText text={entryNo(item.no)} px={1.5} />
                          <span className="sr-only">{entryNo(item.no)}</span>
                          {/* Keeps the label in line with found eggs' marks. */}
                          <BallMark className="invisible" />
                          <span className="type-small flex-1 truncate">
                            {item.label}
                          </span>
                          <span className="shrink-0 text-[12px]">
                            {item.hint}
                          </span>
                        </div>
                      );
                    const active = i === cursor;
                    return (
                      <div
                        key={item.label}
                        id={optionId(i)}
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setSelected(i)}
                        onMouseDown={(event) => event.preventDefault()} // keep focus in the input
                        onClick={() => activate(item)}
                        className={`flex min-h-[44px] cursor-pointer items-center gap-3 px-4 py-2 text-fg ${
                          active ? "bg-surface" : ""
                        }`}
                      >
                        <Cursor
                          className={`shrink-0 ${active ? "" : "invisible"}`}
                        />
                        <PixelText
                          text={entryNo(item.no)}
                          px={1.5}
                          className={active ? "text-fg" : "text-fg-muted"}
                        />
                        <span className="sr-only">{entryNo(item.no)}</span>
                        {item.egg && <BallMark />}
                        <span className="type-small flex-1 truncate">
                          {item.label}
                        </span>
                        <span className="shrink-0 text-[12px] text-fg-muted">
                          {item.hint}
                          {item.external && <span aria-hidden="true"> ↗</span>}
                          {item.external && (
                            <span className="sr-only">
                              {" "}
                              (opens in a new tab)
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : null,
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-4 py-2 type-small text-fg-muted">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> move
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd> select
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>esc</Kbd> close
            </span>
            <span className="ml-auto hidden items-center gap-1.5 sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
          </div>
        </div>
        <div aria-live="polite" className="sr-only">
          {notice}
        </div>
      </div>
    </div>
  );
}
