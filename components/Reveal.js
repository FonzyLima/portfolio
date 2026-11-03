"use client";
import { useLayoutEffect, useRef } from "react";

/**
 * Entrance motion for page content. No animation library: the motion is CSS
 * (see "Reveal" in src/app/globals.css), so this costs almost nothing to ship.
 *
 * <Reveal immediate>  Above the fold. A CSS keyframe rise that starts at first
 *                     paint: no JS, no observer, never at opacity 0.
 * <Reveal>            Below the fold. Fades up once when scrolled into view.
 *
 * Nothing is ever hidden in the server HTML. When JS arrives, every <Reveal>
 * on the page is measured in one batch (one layout read, before that commit
 * paints) and only blocks that start below the viewport are hidden, where
 * nobody can see them go. Blocks already on screen are left alone: no flash,
 * no transition, and no-JS / slow-JS visitors see everything from the start.
 * With reduced motion nothing is hidden at all (CSS).
 *
 * delay      ms, for staggering siblings (e.g. 0/60/120...). For a grid, stagger
 *            by column (index % columns), so later rows don't wait longer.
 * as         element to render (default "div").
 * className  passed through, like any other prop.
 */
export default function Reveal({
  immediate = false,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (immediate || !ref.current) return;
    return track(ref.current);
  }, [immediate]);

  const delayStyle = delay ? { "--reveal-delay": `${delay}ms` } : null;
  return (
    <Tag
      ref={immediate ? undefined : ref}
      className={`${immediate ? "reveal-immediate" : "reveal"} ${className}`.trim()}
      style={delayStyle || style ? { ...delayStyle, ...style } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Reveals mounted in the same commit are measured together in a microtask,
// which runs after React's layout effects and before the browser paints: all
// reads first, then all writes, so one layout pass however many there are.
const queue = new Set();
let flushScheduled = false;

function track(el) {
  queue.add(el);
  if (!flushScheduled) {
    flushScheduled = true;
    queueMicrotask(flush);
  }
  return () => {
    queue.delete(el);
    observer?.unobserve(el);
  };
}

function flush() {
  flushScheduled = false;
  const els = [...queue].filter((el) => el.isConnected && !el.dataset.reveal);
  queue.clear();
  if (!els.length || typeof IntersectionObserver === "undefined") return;
  const viewportBottom = window.innerHeight;
  const below = els.filter((el) => el.getBoundingClientRect().top >= viewportBottom);
  for (const el of below) {
    el.dataset.reveal = "pending";
    getObserver().observe(el);
  }
}

// One IntersectionObserver for every <Reveal> on the page. The bottom margin
// fires the reveal once the block is 10% into the viewport, so the motion is
// seen rather than finished below the fold. Each block reveals once.
let observer = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        target.dataset.reveal = "shown";
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  return observer;
}
