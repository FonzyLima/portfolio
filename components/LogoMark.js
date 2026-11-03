// 16×16 pixel "AL" monogram for the nav, echoing the Gameboy hero.
// "#" = tile, "o" = letter knocked out of it. The tile uses `accent-strong`
// (so it turns gold in shiny mode) and the letters use the page colour.
// Render at multiples of 16px (24 at 2x DPR, 32 at 1x) so pixels stay crisp.
const GRID = [
  ".##############.",
  "################",
  "################",
  "################",
  "####ooo#########",
  "###o###o#o######",
  "###o###o#o######",
  "###ooooo#o######",
  "###o###o#o######",
  "###o###o#o######",
  "###o###o#o######",
  "###o###o#oooo###",
  "################",
  "################",
  "################",
  ".##############.",
];

// One 1-unit-tall rect per horizontal run of the same cell type.
function runs(type) {
  const rects = [];
  GRID.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== type) {
        x++;
        continue;
      }
      const start = x;
      while (x < row.length && row[x] === type) x++;
      rects.push({ x: start, y, w: x - start });
    }
  });
  return rects;
}

const TILE = runs("#");
const LETTERS = runs("o");

export default function LogoMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g className="fill-accent-strong">
        {TILE.map(({ x, y, w }) => (
          <rect key={`t${x}-${y}`} x={x} y={y} width={w} height={1} />
        ))}
      </g>
      <g className="fill-page">
        {LETTERS.map(({ x, y, w }) => (
          <rect key={`l${x}-${y}`} x={x} y={y} width={w} height={1} />
        ))}
      </g>
    </svg>
  );
}
