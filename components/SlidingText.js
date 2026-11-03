"use client";
import { useEffect, useRef } from "react";

// Infinite horizontal marquee, animated in CSS (see `.marquee` in globals.css).
//
// The track holds two identical groups and slides by exactly -50%, so the
// loop restarts on a pixel-identical frame (no visible jump). Each group
// repeats the text until it's wider than the widest screens.
//
// Speed is constant across rows: the duration comes from the row's length, so
// a long row doesn't scroll faster than a short one, and it's in em/s so it
// scales with the type (~50px/s at the desktop size). The server sets an
// estimate from the character count; after mount the real width is measured
// once (and on resize/font load) and the running animation's playback rate is
// corrected without a jump. Rows pause while offscreen and don't move at all
// with reduced motion. Hovering, tapping or tabbing to a row pauses it (WCAG
// 2.2.2), so the row is a tab stop; the CSS is in globals.css.
//
// direction: -1 slides left, 1 slides right.
// speed:     em per second.
const SPEED = 1.15;
const EM_PER_CHAR = 0.52; // average glyph width, for the server estimate
const MIN_GROUP_CHARS = 120; // ~2600px at the 44px size

export default function SlidingText({ text, direction = -1, speed = SPEED }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const groupRef = useRef(null);
  // Spacing between copies is handled here, so trailing spaces in data don't matter.
  const label = text.trim();
  const repeat = Math.max(2, Math.ceil(MIN_GROUP_CHARS / (label.length + 1)));
  const estimate = ((label.length + 0.3) * repeat * EM_PER_CHAR) / speed;

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!root || !track || !group) return;
    const unobserve = observeOffscreen(root);

    // Correct the estimate to the measured width: rate = wanted px/s / actual px/s.
    const correct = () => {
      const animation = track.getAnimations()[0];
      if (!animation) return; // reduced motion: no animation to correct
      const width = group.getBoundingClientRect().width;
      const fontSize = parseFloat(getComputedStyle(group.firstChild).fontSize);
      if (!width || !fontSize) return;
      const rate = (speed * fontSize * estimate) / width;
      if (Math.abs(rate - animation.playbackRate) > 0.005) {
        animation.updatePlaybackRate(rate);
      }
    };
    const resize = new ResizeObserver(correct);
    resize.observe(group);
    return () => {
      resize.disconnect();
      unobserve();
    };
  }, [estimate, speed]);

  const copies = Array.from({ length: repeat }, (_, i) => (
    <span key={i} className="type-marquee shrink-0 pr-[0.3em]">
      {label}
    </span>
  ));

  return (
    <div
      ref={rootRef}
      className="marquee text-fg-muted font-custom"
      role="marquee"
      aria-label={label}
      // Focusable so keyboard users can pause it (.marquee:focus-within).
      tabIndex={0}
    >
      <div
        ref={trackRef}
        className="marquee-track"
        data-reverse={direction === 1 ? "" : undefined}
        style={{ "--marquee-duration": `${estimate.toFixed(2)}s` }}
        aria-hidden="true"
      >
        <div ref={groupRef} className="flex shrink-0">
          {copies}
        </div>
        <div className="flex shrink-0">{copies}</div>
      </div>
    </div>
  );
}

// One IntersectionObserver pauses every offscreen marquee (data-paused).
let observer = null;
function observeOffscreen(el) {
  if (typeof IntersectionObserver === "undefined") return () => {};
  observer ??= new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (isIntersecting) delete target.dataset.paused;
      else target.dataset.paused = "";
    }
  });
  observer.observe(el);
  return () => observer.unobserve(el);
}
