#!/usr/bin/env node
/**
 * Writes public/gameboy/charmander-console.svg: the Charmander back sprite
 * from components/gameboy/gameboyArt.js (MonArt), cropped to GEOMETRY.mon,
 * as a standalone SVG. components/DevtoolsSurprise.js fetches it after idle
 * and draws it in the browser console as a `%c` background image, so the
 * sprite costs nothing in the page bundle.
 *
 * Re-run after `node scripts/split-gameboy.mjs` changes the art.
 * Usage: node scripts/console-sprite.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ART = path.join(ROOT, "components/gameboy/gameboyArt.js");
const OUT = path.join(ROOT, "public/gameboy/charmander-console.svg");
const PAD = 4;

const src = fs.readFileSync(ART, "utf8");
const geometry = JSON.parse(
  src.match(/export const GEOMETRY = (\{[\s\S]*?\n\});/)[1],
);
const fn = src.slice(src.indexOf("export function MonArt()"));
const jsx = fn.slice(fn.indexOf("<>") + 2, fn.indexOf("</>"));
if (/\s[a-z]+[A-Z]\w*=/.test(jsx)) {
  throw new Error(
    "MonArt has camelCase JSX attributes; teach this script to convert them.",
  );
}

const { x0, y0, x1, y1 } = geometry.mon;
const viewBox = [x0 - PAD, y0 - PAD, x1 - x0 + 2 * PAD, y1 - y0 + 2 * PAD]
  .map((n) => Math.round(n * 100) / 100)
  .join(" ");
const body = jsx.replace(/\s+/g, " ").trim();
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" shape-rendering="crispEdges" ` +
  `aria-label="Charmander">${body}</svg>\n`;

fs.writeFileSync(OUT, svg);
console.log(
  `wrote ${path.relative(ROOT, OUT)} (${svg.length} bytes, viewBox ${viewBox})`,
);
