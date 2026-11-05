"use client";
import { useEffect, useRef, useState } from "react";
import { INK, INNER, LINE_Y, PX, TEXT_X } from "./GameboyMenu";
import { textPath } from "./pixelFont";
import { hold, holdFrames } from "./timeline";
import { commitStage } from "../../src/app/lib/partner";

/**
 * The evolution sequence on the Game Boy screen, like the game's: the dialog
 * says "What? NAME is evolving!", the sprite drops to its silhouette and
 * flashes between the old and new shapes faster and faster, the screen
 * flashes white, the new sprite colours in, and the dialog congratulates.
 * A, Enter, B, Escape or a tap dismisses the last line.
 *
 * Played by GameboyHeroClient once the level has earned a new stage
 * (src/app/lib/partner.js: `stage` > `shown`), the intro is done and the hero
 * is on screen. `commitStage` flips html[data-partner] at the swap, which is
 * what shows the new stage everywhere (globals.css). With reduced motion the
 * silhouette flashing is skipped: text, cut, text.
 */

const SILHOUETTE = '[data-gb="mon-silhouette"]';
const ART = '[data-gb="mon-art"]';
const FLASH = '[data-gb="flash"]';
// Flash cadence (ms per held frame), accelerating like the game.
const BEATS = [
  520, 460, 400, 340, 290, 240, 200, 170, 140, 120, 100, 100, 100, 100, 100,
  100,
];
const TEXT_DELAY = 1100;
const FLASH_MS = 160;

const pct = (v, of) => `${(v / of) * 100}%`;
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Keyframes alternating two silhouettes: `first` shows on even beats. */
function beatFrames(first) {
  const total = BEATS.reduce((a, b) => a + b, 0);
  let t = 0;
  const frames = BEATS.map((ms, i) => {
    const f = {
      opacity: (i % 2 === 0) === first ? 1 : 0,
      offset: t / total,
      easing: hold,
    };
    t += ms;
    return f;
  });
  frames.push({
    opacity: (BEATS.length % 2 === 0) === first ? 0 : 1,
    offset: 1,
  });
  return { frames, total };
}

export default function Evolution({
  geometry,
  figureRef,
  from,
  to,
  names,
  onStart,
  onDone,
}) {
  const [phase, setPhase] = useState("start"); // start -> flashing -> done
  const done = useRef(false);
  const fromName = names[from];
  const toName = names[to];

  useEffect(() => {
    onStart({ from, to }); // the parent keeps us mounted until onDone
    const figure = figureRef.current;
    const stage = (n) => figure.querySelector(`.gb-mon[data-stage="${n}"]`);
    const fromG = stage(from);
    const toG = stage(to);
    const fromArt = fromG.querySelector(ART);
    const toArt = toG.querySelector(ART);
    const fromSil = fromG.querySelector(SILHOUETTE);
    const toSil = toG.querySelector(SILHOUETTE);
    const flash = figure.querySelector(FLASH);
    const animations = [];
    let cancelled = false;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));

    const finish = () => {
      if (cancelled) return;
      commitStage(to);
      for (const el of [fromSil, toSil, flash])
        el.removeAttribute("data-flash");
      toG.removeAttribute("data-evolving");
      toArt.style.opacity = "";
      fromArt.style.opacity = "";
      setPhase("done");
    };

    later(() => {
      if (cancelled) return;
      if (prefersReducedMotion()) {
        finish();
        return;
      }
      setPhase("flashing");
      // Show the new stage's group (silhouette only) beside the old one.
      toG.setAttribute("data-evolving", "");
      toArt.style.opacity = "0";
      fromArt.style.opacity = "0";
      fromSil.setAttribute("data-flash", "");
      toSil.setAttribute("data-flash", "");
      const a = beatFrames(true);
      const b = beatFrames(false);
      animations.push(
        fromSil.animate(a.frames, { duration: a.total, fill: "forwards" }),
      );
      animations.push(
        toSil.animate(b.frames, { duration: b.total, fill: "forwards" }),
      );
      later(() => {
        if (cancelled) return;
        flash.setAttribute("data-flash", "");
        const f = flash.animate(holdFrames("opacity", [1, 0]), {
          duration: FLASH_MS,
        });
        animations.push(f);
        // Colour the new stage in under the white, then clean up as it clears.
        later(() => {
          if (cancelled) return;
          animations.forEach((an) => an.cancel());
          finish();
        }, FLASH_MS / 2);
      }, a.total);
    }, TEXT_DELAY);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      animations.forEach((an) => an.cancel());
    };
  }, [figureRef, from, to, onStart]);

  // Dismiss the congratulations with A/Enter/B/Escape.
  useEffect(() => {
    if (phase !== "done") return;
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        ["a", "b", "enter", "escape", " "].includes(event.key.toLowerCase())
      ) {
        event.preventDefault();
        if (!done.current) {
          done.current = true;
          onDone();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [phase, onDone]);

  const lines =
    phase === "done"
      ? ["Congratulations! Your", `${fromName} evolved`, `into ${toName}!`]
      : ["What?", `${fromName} is evolving!`];
  const d = lines
    .map((text, i) => textPath(text, TEXT_X, LINE_Y[i], PX))
    .join("");
  const { width: W, height: H } = geometry;

  return (
    <>
      <svg
        viewBox={geometry.viewBox}
        className="pointer-events-none absolute inset-0 h-full w-full"
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        {/* Cover the baked dialog text, then the lines in the same pixel style. */}
        <rect
          x={INNER.x0}
          y={INNER.y0}
          width={INNER.x1 - INNER.x0}
          height={INNER.y1 - INNER.y0}
          fill="#fff"
        />
        <path d={d} fill={INK} />
        {phase === "done" && (
          <path
            d={[7, 5, 3, 1]
              .map(
                (w, i) =>
                  `M${840 - (w * 2.5) / 2} ${354.5 + i * 2.5}h${w * 2.5}v2.5h-${w * 2.5}z`,
              )
              .join("")}
            fill="#61BC7A"
          />
        )}
      </svg>
      <p className="sr-only" aria-live="polite">
        {phase === "done"
          ? `Congratulations! Your ${fromName} evolved into ${toName}!`
          : `What? ${fromName} is evolving!`}
      </p>
      {phase === "done" && (
        <button
          type="button"
          aria-label="Continue"
          onClick={() => {
            if (done.current) return;
            done.current = true;
            onDone();
          }}
          style={{
            left: pct(INNER.x0, W),
            top: pct(INNER.y0, H),
            width: pct(INNER.x1 - INNER.x0, W),
            height: pct(INNER.y1 - INNER.y0, H),
          }}
          className="absolute cursor-pointer rounded-lg bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] focus-visible:shadow-[0_0_0_6px_#EBEBEB]"
        />
      )}
    </>
  );
}
