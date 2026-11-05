import { GLYPH_ROWS, textPath, textWidth } from "./gameboy/pixelFont";

// A word in the Game Boy's pixel font (components/gameboy/pixelFont.js), as
// an inline SVG that takes the text colour. Letters, digits and a few marks
// (see GLYPHS there); anything else renders as a space.
export default function PixelText({ text, px = 2, className = "" }) {
  const w = textWidth(text, px);
  const h = GLYPH_ROWS * px;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={className}
    >
      <path d={textPath(text, 0, 0, px)} fill="currentColor" />
    </svg>
  );
}
