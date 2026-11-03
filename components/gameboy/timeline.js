/**
 * Battle-intro timing, in seconds. Every beat of the Game Boy hero reads from here
 * (components/gameboy/introCss.js turns it into CSS keyframes).
 *
 * GBA motion is frame-based, so instead of the site's custom ease curves this
 * uses hard steps: `stepped(n)` cuts a tween into n visible frames and `hold`
 * shows each keyframe as a held frame, then cuts to the next.
 */
/**
 * Prefix of every intro keyframes name (./introCss), which GameboyHeroClient finds
 * the intro by. Kept here, not in ./introCss, so the client bundle doesn't pull in
 * the generated art.
 */
export const INTRO_PREFIX = "gb-i-";

export const TIMELINE = {
  // The intro is CSS and starts at first paint, before any JS. The screen stays
  // off for this long so the device's entrance rise (<Reveal immediate>, 500ms)
  // has mostly landed before the first flash.
  startDelay: 0.45,

  // 1. Screen off -> battle transition (~0.6s)
  flash: { count: 3, frame: 0.05 }, // 3 white flashes, 50ms on / 50ms off = 0.3s
  bars: { count: 8, duration: 0.3, steps: 6 }, // black bars slide apart, alternating left/right

  // 2. Send-out (~0.5s), status box slides in from the right in parallel
  sendOut: { fromScale: 0.2, duration: 0.3, steps: 5 }, // flat silhouette grows from the ground up
  colorIn: { duration: 0.2, steps: 4 }, // silhouette fades out, revealing the colour sprite
  statusSlide: { duration: 0.4, steps: 8 },

  // 3. HP + EXP bars (~1s)
  beatGap: 0.1,
  hp: { duration: 0.5, steps: 10 },
  exp: { perDot: 0.012 }, // 35 dots ~0.42s

  // 4. Dialog typewriter (~1.9s for the 4 lines)
  type: {
    unitsPerSecond: 1500, // reveal speed in viewBox units (one glyph is ~11 units)
    unitsPerStep: 11, // ~one glyph per step
    lineGap: 0.06,
  },

  // 5. Idle loops (CSS; only run while the hero is on screen and the tab is visible)
  prompt: { period: 0.8 }, // the "press A" arrow: 0.4s on / 0.4s off
  idle: {
    period: 1, // one bob cycle per second, 2 frames
    monBob: 3, // viewBox units, down
    statusBob: -2, // viewBox units, up: out of phase with the sprite
    flamePeriod: 0.4,
    flameScaleY: 0.88,
  },

  // 6. Interaction
  hop: { height: 6, duration: 0.12 }, // 2 frames: airborne, landed (flame tip sits ~4 units under the screen edge)
  pokeFlash: 0.12, // reduced-motion feedback: one silhouette frame, no movement
  shinyPokes: 10, // every 10th poke toggles shiny mode (src/app/lib/shiny.js), with a 3-flash sparkle
};

/** Hold each keyframe for its share of the duration, then cut (CSS / WAAPI easing). */
export const hold = "steps(1, end)";

/** Split a tween into n hard frames. */
export const stepped = (n) => `steps(${Math.max(1, Math.round(n))}, end)`;

/** Frame list for a hold animation: [on, off, on, off, ..., off]. */
export function flashFrames(count) {
  return [...Array.from({ length: count }, () => [1, 0]).flat(), 0];
}

/** Web Animations keyframes that hold each value, then cut to the next. */
export const holdFrames = (property, values) =>
  values.map((value) => ({ [property]: value, easing: hold }));
