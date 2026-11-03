import { GEOMETRY } from "./gameboyArt";
import { INTRO_PREFIX, TIMELINE as T, flashFrames, hold, stepped } from "./timeline";

/**
 * The battle intro and idle loops as CSS, generated from TIMELINE and inlined
 * by GameboySvg. Why CSS: it starts at first paint (no waiting for hydration or
 * an animation library), it needs zero JS bytes, and the browser stops it for
 * free. GameboyHero only holds it if the hero is offscreen when JS arrives,
 * learns when it ends, and toggles the idle loops.
 *
 * States, set on the hero's <figure class="gb-hero">:
 * - no `js` class on <html>, or reduced motion: nothing applies, so the
 *   server-rendered finished frame shows (GameboySvg).
 * - default: the intro runs. Every layer gets one animation that spans the
 *   whole intro (same duration, no delays), with its beats as keyframe
 *   percentages and hard-step timing per segment. All of them end on the
 *   finished frame and fill forwards, so they can be held and rewound as one.
 * - data-intro="done": intro rules drop away, leaving the finished frame, and
 *   the intro-only layers are display:none (see INTRO_ONLY).
 * - data-idle: the 2-frame idle loops run.
 */

const { screen: S, status: STATUS, textLines, expCount } = GEOMETRY;

// White "erasers" over each baked text line; the typewriter shrinks them to the right.
export const ERASERS = textLines.map((l) => ({
  x: l.x0 - 3,
  y: l.y0 - 2,
  width: l.x1 - l.x0 + 6,
  height: l.y1 - l.y0 + 4,
}));

// Slide start for the status box: just past the screen's right edge.
const STATUS_OFFSCREEN = S.x + S.width - STATUS.x0 + 8;

/** Start/end of every beat, in seconds from first paint. */
function schedule() {
  const s = {};
  let t = T.startDelay;
  s.flash = [t, (t += T.flash.count * 2 * T.flash.frame)];
  s.bars = [t, (t += T.bars.duration)];
  s.send = [t, t + T.sendOut.duration];
  s.status = [t, t + T.statusSlide.duration];
  s.colorIn = [s.send[1], s.send[1] + T.colorIn.duration];
  t = Math.max(s.colorIn[1], s.status[1]) + T.beatGap;
  s.hp = [t, (t += T.hp.duration)];
  // Dots light up one per frame, left to right.
  s.exp = Array.from({ length: expCount }, (_, i) => t + (i + 1) * T.exp.perDot);
  t += expCount * T.exp.perDot;
  s.type = ERASERS.map(({ width }, i) => {
    const start = t + (i === 0 ? T.beatGap : T.type.lineGap);
    t = start + width / T.type.unitsPerSecond;
    return { start, end: t, steps: width / T.type.unitsPerStep };
  });
  s.total = t;
  return s;
}
export const INTRO = schedule();

// INTRO_PREFIX lives in ./timeline so the client hero can read it without
// importing this module (and, through it, the art).
export { INTRO_PREFIX };

const total = INTRO.total;
const pct = (t) => `${+((Math.min(t, total) / total) * 100).toFixed(3)}%`;
// [time, declarations, timing of the segment that follows]
const keyframes = (name, frames) =>
  `@keyframes ${INTRO_PREFIX}${name}{${frames
    .map(([t, decl, ease = hold]) => `${pct(t)}{${decl};animation-timing-function:${ease}}`)
    .join("")}}`;

const tx = (x) => `transform:translateX(${x}px)`;
const flashKeys = flashFrames(T.flash.count).map((v, i) => [
  INTRO.flash[0] + i * T.flash.frame,
  `opacity:${v}`,
]);

const TRACKS = {
  // Screen on: white flashes over the black screen.
  flash: ['[data-gb="flash"]', [[0, "opacity:0"], ...flashKeys, [total, "opacity:0"]]],
  // Black bars slide apart in hard steps, then go.
  "bar-l": ['[data-gb="bar-l"]', [
    [0, `opacity:1;${tx(0)}`],
    [INTRO.bars[0], `opacity:1;${tx(0)}`, stepped(T.bars.steps)],
    [INTRO.bars[1], `opacity:1;${tx(-S.width)}`],
    [total, `opacity:0;${tx(-S.width)}`],
  ]],
  "bar-r": ['[data-gb="bar-r"]', [
    [0, `opacity:1;${tx(0)}`],
    [INTRO.bars[0], `opacity:1;${tx(0)}`, stepped(T.bars.steps)],
    [INTRO.bars[1], `opacity:1;${tx(S.width)}`],
    [total, `opacity:0;${tx(S.width)}`],
  ]],
  // Send-out: the flat silhouette grows from the ground, then colour comes in.
  send: ['[data-gb="mon-send"]', [
    [0, `transform:scale(${T.sendOut.fromScale})`],
    [INTRO.send[0], `transform:scale(${T.sendOut.fromScale})`, stepped(T.sendOut.steps)],
    [INTRO.send[1], "transform:scale(1)"],
    [total, "transform:scale(1)"],
  ]],
  art: ['[data-gb="mon-art"]', [[0, "opacity:0"], [INTRO.send[1], "opacity:1"], [total, "opacity:1"]]],
  silhouette: ['[data-gb="mon-silhouette"]', [
    [0, "opacity:0"],
    [INTRO.send[0], "opacity:1"],
    [INTRO.colorIn[0], "opacity:1", stepped(T.colorIn.steps)],
    [INTRO.colorIn[1], "opacity:0"],
    [total, "opacity:0"],
  ]],
  // Status box slides in from the right, alongside the send-out.
  status: ['[data-gb="status"]', [
    [0, tx(STATUS_OFFSCREEN)],
    [INTRO.status[0], tx(STATUS_OFFSCREEN), stepped(T.statusSlide.steps)],
    [INTRO.status[1], tx(0)],
    [total, tx(0)],
  ]],
  // HP fills in hard steps.
  hp: ['[data-layer="hp-fill"]', [
    [0, "transform:scaleX(0)"],
    [INTRO.hp[0], "transform:scaleX(0)", stepped(T.hp.steps)],
    [INTRO.hp[1], "transform:scaleX(1)"],
    [total, "transform:scaleX(1)"],
  ]],
  // The ▼ prompt waits for the end of the typing.
  prompt: ['[data-gb="prompt"]', [[0, "opacity:0"], [total, "opacity:0"]]],
};
// Typewriter: each line's eraser shrinks to the right, ~one glyph per step.
INTRO.type.forEach(({ start, end, steps }, i) => {
  TRACKS[`type-${i}`] = [`[data-gb="eraser"][data-line="${i}"]`, [
    [0, "opacity:1;transform:scaleX(1)"],
    [start, "opacity:1;transform:scaleX(1)", stepped(steps)],
    [end, "opacity:1;transform:scaleX(0)"],
    [total, "opacity:1;transform:scaleX(0)"],
  ]];
});

const HERO = ".gb-hero";
const PLAYING = `html.js ${HERO}:not([data-intro="done"])`;
const IDLE = `${HERO}[data-intro="done"][data-idle]`;
const { idle } = T;

// Layers that only exist for the intro: the silhouette (a <use> clone of the
// whole sprite, ~200 nodes), the bars, the flash and the typewriter erasers.
// Outside the intro they're transparent, so they're taken out of rendering
// altogether (display:none): every theme change restyles every element on the
// page, and these were a fifth of it. The silhouette is shown again for the
// poke flashes (GameboyHero sets data-flash while one runs).
const INTRO_ONLY = ':is([data-gb="mon-silhouette"],[data-gb="bar-l"],[data-gb="bar-r"],[data-gb="flash"],[data-gb="eraser"])';

const css = [
  // Scale origins, matching the art: the sprite grows from its feet, HP fills
  // from the left, erasers shrink to the right, the flame flickers from its base.
  `${HERO} [data-gb],${HERO} [data-layer]{transform-box:fill-box}`,
  `${HERO} [data-gb="mon-send"],${HERO} [data-layer="mon-flame"]{transform-origin:50% 100%}`,
  `${HERO} [data-layer="hp-fill"]{transform-origin:0 50%}`,
  `${HERO} [data-gb="eraser"]{transform-origin:100% 50%}`,
  `${HERO} ${INTRO_ONLY}:not([data-flash]){display:none}`,
  "@media (prefers-reduced-motion:no-preference){",
  `${PLAYING} ${INTRO_ONLY}{display:inline}`,
  ...Object.entries(TRACKS).map(
    ([name, [selector]]) =>
      `${PLAYING} ${selector}{animation:${INTRO_PREFIX}${name} ${total.toFixed(3)}s linear forwards}`,
  ),
  `${PLAYING} [data-layer="exp"] rect{animation:${INTRO_PREFIX}dot 1s ${hold} forwards}`,
  ...INTRO.exp.map(
    (t, i) => `${PLAYING} [data-layer="exp"] rect:nth-child(${i + 1}){animation-duration:${t.toFixed(3)}s}`,
  ),
  // Idle: 2-frame loops.
  `${IDLE} [data-gb="mon-bob"]{animation:gb-bob ${idle.period}s ${hold} infinite}`,
  `${IDLE} [data-gb="status"]{animation:gb-status-bob ${idle.period}s ${hold} infinite}`,
  `${IDLE} [data-layer="mon-flame"]{animation:gb-flame ${idle.flamePeriod}s ${hold} infinite}`,
  `${IDLE} [data-gb="prompt"]{animation:gb-blink ${T.prompt.period}s ${hold} infinite}`,
  "}",
  ...Object.entries(TRACKS).map(([name, [, frames]]) => keyframes(name, frames)),
  `@keyframes ${INTRO_PREFIX}dot{from{opacity:0}to{opacity:1}}`,
  `@keyframes gb-bob{50%{transform:translateY(${idle.monBob}px)}}`,
  `@keyframes gb-status-bob{50%{transform:translateY(${idle.statusBob}px)}}`,
  `@keyframes gb-flame{50%{transform:scaleY(${idle.flameScaleY})}}`,
  "@keyframes gb-blink{50%{opacity:0}}",
];

export const GAMEBOY_CSS = css.join("");
