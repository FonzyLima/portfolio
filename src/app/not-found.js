import Button from "../../components/Button";
import { GEOMETRY, MonArt } from "../../components/gameboy/gameboyArt";

export const metadata = {
  title: "404 | Alfonso Lima",
  description: "A wild 404 appeared. The page you were looking for fled into the tall grass.",
};

// Crop the hero's Charmander back sprite to its own bounding box (it's drawn
// in the full 960x511 Game Boy viewBox) with a little breathing room.
const { mon } = GEOMETRY;
const PAD = 6;
const SPRITE_VIEWBOX = `${mon.x0 - PAD} ${mon.y0 - PAD} ${mon.x1 - mon.x0 + PAD * 2} ${
  mon.y1 - mon.y0 + PAD * 2
}`;

// Pixel tufts of tall grass. 4px "pixels" on an 8x4 grid, repeated across the panel.
const PX = 4;
const TUFT = [
  [1, 0],
  [4, 0],
  [0, 1],
  [2, 1],
  [3, 1],
  [5, 1],
  [6, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 2],
  [6, 2],
  [7, 2],
  [0, 3],
  [1, 3],
  [2, 3],
  [3, 3],
  [4, 3],
  [5, 3],
  [6, 3],
  [7, 3],
];

function TallGrass() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-8 w-full"
      focusable="false"
    >
      <defs>
        <pattern id="encounter-grass" width={PX * 8} height={PX * 4} patternUnits="userSpaceOnUse">
          {TUFT.map(([x, y]) => (
            <rect
              key={`${x}-${y}`}
              x={x * PX}
              y={y * PX}
              width={PX}
              height={PX}
              className="fill-accent"
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#encounter-grass)" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="page-container pt-24 lg:pt-32">
      <div className="flex flex-col gap-4 lg:gap-5 lg:items-center lg:text-center">
        <p className="type-body text-fg-muted">Route 404</p>
        <h1 className="type-display text-fg [text-wrap:balance]">
          A wild <span className="text-accent-strong">404</span> appeared!
        </h1>
        <p className="type-lead max-w-[65ch] text-fg-muted">
          The page you were looking for fled into the tall grass. It may have moved, been renamed, or
          never existed.
        </p>
      </div>

      {/* Encounter scene */}
      <div className="mx-auto mt-10 flex w-full max-w-[560px] flex-col gap-6 lg:mt-14">
        <div className="relative flex h-[220px] items-end justify-center overflow-hidden rounded-lg bg-surface shadow-1 sm:h-[260px]">
          <svg
            role="img"
            aria-label="A glitching Charmander sprite standing in tall grass"
            viewBox={SPRITE_VIEWBOX}
            className="encounter-sprite relative z-10 mb-5 h-[150px] w-auto sm:h-[180px]"
            shapeRendering="crispEdges"
          >
            <MonArt />
          </svg>
          <TallGrass />
        </div>

        {/* Battle dialog */}
        <div
          className="relative rounded-lg border-2 border-line-strong bg-surface-raised p-5 shadow-2 lg:p-6"
          aria-live="polite"
        >
          <p className="type-body text-fg">Wild 404 used Teleport!</p>
          <p className="type-body text-fg-muted">The page got away...</p>
          <span
            aria-hidden="true"
            className="encounter-prompt absolute bottom-3 right-4 text-[12px] leading-none text-accent-strong lg:text-[13px]"
          >
            &#9660;
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button title="Run" destination="/" />
          <Button title="Fight back: see my work" destination="/portfolio" variant="secondary" icon="next" />
        </div>
      </div>
    </div>
  );
}
