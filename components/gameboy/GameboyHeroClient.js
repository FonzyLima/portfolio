"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GameboyMenu, { DIALOG } from "./GameboyMenu";
import {
  INTRO_PREFIX,
  TIMELINE as T,
  flashFrames,
  hold,
  holdFrames,
} from "./timeline";
import { toggleShiny } from "../../src/app/lib/shiny";
import { EXP, gainExp, usePartner } from "../../src/app/lib/partner";
import { STAGE_NAMES } from "./partnerArt";
import StatusName from "./StatusName";
import Evolution from "./Evolution";

// Must match the text drawn in public/gameboy.svg (the dialog-text path).
const DIALOG_TEXT =
  "Hi! I’m Alfonso, an AI engineer at Tenext AI. I build web, mobile, and AI apps, from React Native and Django to ElevenLabs voice calls. Press A to look around.";

const SILHOUETTE = '[data-gb="mon-silhouette"]';
const HOP = '[data-gb="mon-hop"]';

// Narrowest the hero renders: a 320px viewport minus page.js's px-6 (2 x 24px).
// Its max-w-[300px] only applies from 348px up.
const SMALLEST_RENDER_WIDTH = 272;
const pct = (v, of) => `${(v / of) * 100}%`;

// Hit area for the sprite button: centred on the sprite, >= 44px square even at
// SMALLEST_RENDER_WIDTH, and ending above the dialog box (the menu's A button is
// later in the DOM, so it would cover any overlap and shrink this target).
function hitStyle({ screen: S, mon: MON, panelTop, width: W, height: H }) {
  const min = Math.ceil((44 * W) / SMALLEST_RENDER_WIDTH);
  const w = Math.max(min, MON.x1 - MON.x0 + 24);
  const h = Math.max(min, panelTop - S.y + 12);
  const cx = (MON.x0 + MON.x1) / 2;
  const cy = Math.min((S.y + panelTop) / 2, DIALOG.y0 - h / 2);
  return {
    left: pct(cx - w / 2, W),
    top: pct(cy - h / 2, H),
    width: pct(w, W),
    height: pct(h, H),
  };
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Game Boy hero with a GBA Pokémon-style battle intro.
 *
 * The intro and idle loops are CSS generated from ./timeline (see ./introCss),
 * so the screen comes on from the first paint, with no animation library and
 * no per-frame JS. This component only:
 * - holds the intro on its first frame if the hero wasn't on screen (or the tab
 *   was hidden) when JS arrived, and plays it once it's seen;
 * - marks the intro done when it ends (or is skipped by poking Charmander), which
 *   enables the "press A" menu and the idle loops;
 * - runs the idle loops only while the hero is on screen and the tab is visible.
 *   Offscreen they're removed, not paused, so nothing ticks;
 * - draws the partner's live name and level in the status box (./StatusName)
 *   and plays the evolution sequence (./Evolution) when the level has earned
 *   a new stage (src/app/lib/partner.js).
 * No JS or reduced motion: the server-rendered finished frame, no loops.
 *
 * The art (`art`: base image + animated overlay with its inlined CSS) is
 * rendered by the server wrapper (./GameboyHero) and passed in as RSC output, so
 * its ~450 SVG nodes are HTML, not client JS. This component only reaches into
 * it with querySelector. `geometry` is the subset of GEOMETRY it needs, passed as
 * a prop for the same reason (importing ./gameboyArt here would bundle the art).
 */
export default function GameboyHeroClient({ art, geometry, className = "" }) {
  const figureRef = useRef(null);
  const hit = useMemo(() => hitStyle(geometry), [geometry]);
  const intro = useRef(null); // { animations, seen }
  const [introDone, setIntroDone] = useState(false);
  // null until the first IntersectionObserver report, so nothing is decided early.
  const [inView, setInView] = useState(null);
  const [pageVisible, setPageVisible] = useState(true);

  // "Press A" menu (GameboyMenu). It only works once the intro has finished or
  // been skipped, and the hint under the Game Boy goes away after the first open.
  const [menuOpen, setMenuOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const openMenu = useCallback(() => {
    setMenuOpen(true);
    setEverOpened(true);
    gainExp("menu", EXP.menu);
  }, []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // The partner: its name and level show in the status box; when the level has
  // earned a stage beyond the one drawn, the evolution plays here (once the
  // intro is done, the hero is on screen and the menu is closed) and commits.
  const partner = usePartner();
  const species = STAGE_NAMES[partner.shown];
  const name = partner.nick || species;
  // `scene` latches the sequence once it starts (Evolution calls onStart), so it
  // plays to its last line after commitStage has already caught `shown` up.
  const [scene, setScene] = useState(null); // { from, to }
  const evolveStart = useCallback((next) => setScene(next), []);
  const evolveDone = useCallback(() => setScene(null), []);

  // Find the running CSS intro and wait for it to end. All its animations share
  // one duration, so they end together. Cancelled (skip, or reduced motion
  // switched on mid-intro) counts as ended too.
  useEffect(() => {
    const animations = figureRef.current
      .getAnimations({ subtree: true })
      .filter((a) => a.animationName?.startsWith(INTRO_PREFIX));
    intro.current = { animations, seen: false };
    let cancelled = false;
    const done = () => {
      if (!cancelled) setIntroDone(true);
    };
    // Nothing to wait for (no JS class, reduced motion, or it already ended
    // before hydration): resolves on the next microtask.
    Promise.all(animations.map((a) => a.finished)).then(done, done);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const figure = figureRef.current;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(figure);
    const onVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Until the intro has been seen once, hold it on its first frame (screen
  // off) whenever it can't be seen: e.g. a reload restored the scroll position
  // below the hero, or the page opened in a background tab. Once seen, it plays
  // through, like a real power-on.
  const canSee = inView === true && pageVisible;
  useEffect(() => {
    const s = intro.current;
    if (!s || introDone || inView === null || s.seen) return;
    if (canSee) {
      s.seen = true;
      s.animations.forEach((a) => a.playState === "paused" && a.play());
    } else {
      s.animations.forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
    }
  }, [canSee, inView, introDone]);

  // Silhouette flashes (poke feedback). The silhouette is display:none outside
  // the intro (see INTRO_ONLY in ./introCss), so data-flash shows it while a
  // flash runs. A new flash replaces the one running.
  const flash = useRef(null);
  const flashSilhouette = useCallback((values, duration) => {
    const el = figureRef.current?.querySelector(SILHOUETTE);
    if (!el) return;
    flash.current?.cancel();
    el.setAttribute("data-flash", "");
    const animation = el.animate(holdFrames("opacity", values), { duration });
    flash.current = animation;
    const end = () => {
      if (flash.current !== animation) return;
      flash.current = null;
      el.removeAttribute("data-flash");
    };
    animation.finished.then(end, end);
  }, []);

  const pokes = useRef(0);
  const poke = useCallback(() => {
    const figure = figureRef.current;
    // Poking during the intro skips to the finished screen, like pressing A on a GBA.
    if (!introDone) {
      setIntroDone(true);
      return;
    }
    // Easter egg: the 10th poke toggles shiny mode. Feedback is the shiny sparkle's
    // GBA cousin, three silhouette flashes (opacity only, so fine with reduced motion).
    if (++pokes.current >= T.shinyPokes) {
      pokes.current = 0;
      toggleShiny();
      flashSilhouette(flashFrames(3), 6 * T.pokeFlash * 1000);
      return;
    }
    if (prefersReducedMotion()) {
      // Feedback without movement: one silhouette frame.
      flashSilhouette([1, 0], T.pokeFlash * 1000);
      return;
    }
    // Hop: two frames, airborne then landed.
    figure
      .querySelector(HOP)
      ?.animate(
        [
          { transform: `translateY(${-T.hop.height}px)`, easing: hold },
          { transform: "none" },
        ],
        { duration: T.hop.duration * 1000 },
      );
  }, [introDone, flashSilhouette]);

  const pendingStage = partner.stage > partner.shown ? partner.stage : null;
  const evolving =
    scene ??
    (pendingStage !== null && introDone && canSee && !menuOpen
      ? { from: partner.shown, to: pendingStage }
      : null);

  const idle = introDone && canSee;
  const showHint = introDone && !everOpened && !evolving;

  return (
    <div className={`relative ${className}`}>
      <figure
        ref={figureRef}
        data-intro={introDone ? "done" : undefined}
        data-idle={idle ? "" : undefined}
        aria-label={`Game Boy Advance SP showing a Pokémon battle: ${name}${partner.nick ? ` the ${species}` : ""}, level ${partner.level}, 20 of 20 HP`}
        className="gb-hero gameboy-lift relative m-0 aspect-[960/511]"
      >
        {art}
        <StatusName
          figureRef={figureRef}
          name={name}
          level={partner.level}
          show={partner.custom}
        />
        <p className="sr-only">{DIALOG_TEXT}</p>
        <button
          type="button"
          onClick={evolving ? undefined : poke}
          aria-label={`Poke ${name}`}
          style={hit}
          className="absolute cursor-pointer rounded-lg bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] focus-visible:shadow-[0_0_0_6px_#EBEBEB]"
        />
        {evolving && (
          <Evolution
            geometry={geometry}
            figureRef={figureRef}
            from={evolving.from}
            to={evolving.to}
            names={
              partner.nick ? STAGE_NAMES.map(() => partner.nick) : STAGE_NAMES
            }
            onStart={evolveStart}
            onDone={evolveDone}
          />
        )}
        <GameboyMenu
          geometry={geometry}
          ready={introDone && !evolving}
          inView={inView === true}
          open={menuOpen}
          onOpen={openMenu}
          onClose={closeMenu}
        />
      </figure>
      {/* Space is reserved so the hint doesn't shift the page when it appears. */}
      <p
        aria-hidden={!showHint}
        className={`mt-4 min-h-[24px] text-center type-small text-fg-muted transition-opacity duration-[240ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
          showHint ? "opacity-100" : "opacity-0"
        }`}
      >
        Press{" "}
        <kbd className="rounded border border-line-strong px-1.5 py-0.5 text-[12px] font-medium text-fg lg:text-[13px]">
          A
        </kbd>{" "}
        or tap the text box
      </p>
    </div>
  );
}
