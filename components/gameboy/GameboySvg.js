import { ArtDefs, GEOMETRY, MonArt, StatusArt } from "./gameboyArt";
import { ERASERS, GAMEBOY_CSS } from "./introCss";
import { TIMELINE } from "./timeline";

export { ERASERS };

/**
 * Inline overlay drawn on top of public/gameboy/base.svg with the same viewBox.
 * Holds only what animates: status box, Charmander, text erasers, the ▼ prompt
 * and the battle-transition bars. Server-rendered in its FINAL frame (everything
 * visible, transition layers transparent), so no-JS and reduced-motion users get
 * the finished screen. The intro and idle loops are CSS (./introCss), inlined
 * here so they apply from the first paint.
 *
 * Server-only in practice: rendered by ./GameboyHero (a server component) and
 * passed to the client half as a prop, so none of this is in the client bundle.
 * Don't import it from a "use client" module.
 */

const { screen: S, panelTop } = GEOMETRY;
const right = S.x + S.width;

// Screen area above the dialog panel. In the original file the status box and the
// sprite sit *under* the panel (the sprite's feet are cut off by it); clipping the
// overlay here reproduces that stacking exactly.
const TOP_CLIP = `M${S.x} ${panelTop}V${S.y + S.rx}A${S.rx} ${S.rx} 0 0 1 ${S.x + S.rx} ${S.y}H${right - S.rx}A${S.rx} ${S.rx} 0 0 1 ${right} ${S.y + S.rx}V${panelTop}Z`;

const ACCENT = "#61BC7A"; // site green (light-mode accent token): send-out silhouette and the ▼ prompt

// ▼ prompt, bottom-right of the dialog, built from 2.5-unit "pixels".
const PX = 2.5;
const PROMPT_CX = 840;
const PROMPT_TOP = 354.5;
const PROMPT_ROWS = [7, 5, 3, 1].map((w, i) => ({
  x: PROMPT_CX - (w * PX) / 2,
  y: PROMPT_TOP + i * PX,
  width: w * PX,
  height: PX,
}));

const BAR_H = S.height / TIMELINE.bars.count;
const BARS = Array.from({ length: TIMELINE.bars.count }, (_, i) => ({
  y: S.y + i * BAR_H,
  side: i % 2 === 0 ? "bar-l" : "bar-r",
}));

// Layers that only exist during the intro are transparent in the final (SSR) frame via the
// `opacity` presentation attribute, which any CSS animation value overrides. When the intro
// rules drop away, the attributes are the finished frame again.

function GameboySvg() {
  return (
    <svg
      viewBox={GEOMETRY.viewBox}
      className="pointer-events-none absolute inset-0 h-full w-full"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {/* Static, trusted CSS generated at build time from the timeline. */}
      <style dangerouslySetInnerHTML={{ __html: GAMEBOY_CSS }} />
      <defs>
        <ArtDefs />
        <clipPath id="gb-clip-top">
          <path d={TOP_CLIP} />
        </clipPath>
        <clipPath id="gb-clip-screen">
          <rect x={S.x} y={S.y} width={S.width} height={S.height} rx={S.rx} />
        </clipPath>
        {/* Flat single-colour copy of the sprite for the send-out silhouette. Not white (as on
            the GBA): this battle background is near-white, so the site accent green reads instead. */}
        <filter id="gb-silhouette" colorInterpolationFilters="sRGB">
          <feFlood floodColor={ACCENT} />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      </defs>

      <g clipPath="url(#gb-clip-top)">
        <g data-gb="status">
          <StatusArt />
        </g>
        <g data-gb="mon-hop">
          <g data-gb="mon-bob">
            <g data-gb="mon-send">
              <g data-gb="mon-art">
                {/* id on an inner group: <use> clones it, and must not inherit mon-art's opacity */}
                <g id="gb-mon-sprite">
                  <MonArt />
                </g>
              </g>
              <use href="#gb-mon-sprite" data-gb="mon-silhouette" filter="url(#gb-silhouette)" opacity={0} />
            </g>
          </g>
        </g>
      </g>

      {ERASERS.map((r, i) => (
        <rect key={i} data-gb="eraser" data-line={i} {...r} fill="#fff" opacity={0} />
      ))}

      <g data-gb="prompt" fill={ACCENT}>
        {PROMPT_ROWS.map((r, i) => (
          <rect key={i} {...r} />
        ))}
      </g>

      <g clipPath="url(#gb-clip-screen)">
        {BARS.map((b, i) => (
          // +0.5 overlap hides hairline seams between bars
          <rect key={i} data-gb={b.side} x={S.x} y={b.y} width={S.width} height={BAR_H + 0.5} fill="#000" opacity={0} />
        ))}
        <rect data-gb="flash" x={S.x} y={S.y} width={S.width} height={S.height} fill="#fff" opacity={0} />
      </g>
    </svg>
  );
}

export default GameboySvg;
