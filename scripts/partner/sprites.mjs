// The partner's later stages, on the Charmander back sprite's grid (2.49-unit
// pixels, feet on its ground line). Both are hand pixel grids traced from
// their FireRed back sprites (one letter per pixel, "." is clear). Rendered
// to components/gameboy/partnerArt.js and the console SVGs by
// ../partner-art.mjs; edit the grids here and rerun that script.
//
// Height is capped at 47 rows: the screen's top edge clips anything taller
// (Charmander is 46), so the evolutions grow sideways.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PX = 2.49; // viewBox units per sprite pixel (matches the baked art)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Letter -> fill. Letters shared with Charmander's art reuse its exact fills so
// shiny mode's recolours (globals.css) apply to every stage.
export const FILLS = {
  a: "#E98E3D", // orange body
  b: "#E5BB52", // cream: head highlight, horns, claws
  c: "#D33C30", // body shade (red)
  d: "#F3A33B", // flame, light
  e: "#DC682A", // flame, dark
  g: "#3B140A", // outline
  r: "#D9553A", // Charmeleon body (red-orange)
  m: "#BB2B29", // Charmeleon shade
  p: "#F26B52", // Charmeleon lit side
  h: "#F9A98A", // Charmeleon highlight
  o: "#F2A94E", // Charizard lit orange
  s: "#D1631F", // Charizard shade
  k: "#8E3A10", // Charizard dark lines and inner mouth edge
  u: "#C8403A", // Charizard mouth
  n: "#F8F8F8", // teeth, eye
};
export const FLAME = new Set(["d", "e"]);

/* ---------- the baked Charmander, as a grid, for its flame ---------- */

function bakedGrid() {
  const src = fs.readFileSync(path.join(ROOT, "components/gameboy/gameboyArt.js"), "utf8");
  const geo = JSON.parse(src.slice(src.indexOf("{", src.indexOf("export const GEOMETRY")), src.indexOf("};", src.indexOf("export const GEOMETRY")) + 1));
  const body = src.slice(src.indexOf("export function MonArt"), src.indexOf("\n}", src.indexOf("export function MonArt")));
  const { x0, y0, x1, y1 } = geo.mon;
  const W = Math.round((x1 - x0) / PX), H = Math.round((y1 - y0) / PX);
  const grid = Array.from({ length: H }, () => Array(W).fill("."));
  const byFill = Object.fromEntries(Object.entries(FILLS).map(([k, v]) => [v, k]));
  for (const m of body.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" fill="(#[0-9A-Fa-f]+)"/g)) {
    const c0 = Math.round((+m[1] - x0) / PX), r0 = Math.round((+m[2] - y0) / PX);
    const cw = Math.max(1, Math.round(+m[3] / PX)), rh = Math.max(1, Math.round(+m[4] / PX));
    const letter = byFill[m[5].toUpperCase()] ?? "?";
    for (let y = r0; y < r0 + rh && y < H; y++) for (let x = c0; x < c0 + cw && x < W; x++) grid[y][x] = letter;
  }
  return { grid, W, H, geo };
}
export const BAKED = bakedGrid();

/* ---------- the stages ---------- */

// Charmeleon, pixel by pixel (one letter per 2.49-unit pixel, "." is clear).
// Traced from the FireRed back sprite into this palette: h highlight, p lit,
// r mid, m shade, g outline, d/e flame. Only the top 47 rows fit the screen,
// the panel covers the rest, as the game's dialog box does.
const CHARMELEON_ROWS = [
  ".................mmm...............................",
  "................m.h.g..............................",
  "...............gphhrpg.............................",
  "...............gpppppg.............................",
  "...............gmpppppg............................",
  "................grpppppg...........................",
  "................gmrpppppgg.........................",
  ".................grrppppppgg.......................",
  ".................grrrppppphhgg.....................",
  ".................grrrppppprhhhg....................",
  "................mprrppppppppphhg...................",
  "...............mhhppppppppppppppgg......d..........",
  "..............mphhhpppppppppppppppg.....dd....e....",
  "..............mhhhhppppppppppppppppg.....dd........",
  ".............grhhhhppppppppppppppppg.....dd........",
  ".............gpphrhppppppppppprrrrrg.....ddd..d....",
  ".............gpppppppppppppprrrrrrg.......dd...e.d.",
  ".............grpppppppppppprrrrrrr........dd...d...",
  ".............grpppppppppprrrrrrrrr........ddd.dde..",
  ".............gmrrpppppprrrrrrrrrrrg.......dddddde..",
  "..............grrrppppprrrrrrrrrrrm.......dddddde..",
  "..............gmrrrrrrrrrrrrrrrrrrpg......dddddee..",
  "...............grrrrrrrrrrrrrrrrrrrpg....dedddee...",
  "...............grrrrrrrrrrrrrrrmrrrrg...deeedeee...",
  "...............grrrrrrrrrrrrrrmgmrrg....deedede....",
  "..............grrrrrrrrrrrrmrrrmmrmg...deeeedeee..d",
  ".............gpprrrrrrrrrrgggrrmggg..ddeeeeeeeee.dd",
  "...........mmhppprrrrrrrrg...ggg....deeeeedeeeeddde",
  "..........mhhhppprrrrrrrg...........eeeeeddeeeddde.",
  ".........rhhhpppprrrrrrmg...........eededdddeedee..",
  "........mhhhpppprrrrrrrrrmg........reddededdeeeee..",
  ".......mhhhppppprrrrrrrrmppg.......redddeedddeeee..",
  "......mhhhpppppprrrrrrrrppppg......reddddeeddeeee..",
  ".....mhhrpppppprrrrrrrrpppppr.......eddddeedddeee..",
  "....gpppppppprrrrrrrrrrppppppg......eeddeeedddee...",
  "...gpppppppprrrrrrrrrrrppppppm.......eeddeeddee....",
  "...gppppppprrrrrrrrrrrrrppppprg.......rmhhghpr.....",
  "..gpppppppprrrrrrrrrrrrmrppprrg........mphgrr......",
  "..gppppppprrrrrrrrrrrrrmgmrrrrrg......gpprg........",
  ".gpppppppprrrrrrrrrrrrrhggmrrrrmg.....mppmg........",
  ".gppppppprrrrrrrrrrrrrrhggrrrrrrmg...gppmg.........",
  ".gppppppprrrrrrrrrrrrrhhg.grrrrrrg..gpppmg.........",
  "grrpppprrrrrrrrrrrrrrrhhg.grrrrrrmggppprrg.........",
  "grrrrrrrrrrrrrrrrrrrrmhhg..grrrrmmmppprrg..........",
  "gmrrrrrrrrrrrrrrrrrrmhhg...gmrrggpppprrrg..........",
  "gmrrrrrrrrrrrgrrrrrrmhhg...ggggppppprrrg...........",
  "gmrrrrrrrrrrrrmmrrrrhhhgggggpppppprrrrrg...........",
];

// Charizard, traced the same way from its FireRed back sprite: a lit tone,
// the orange, a shade, dark brown lines, cream wing and belly, the open red
// mouth and white teeth and eye. The tail flame is off-screen, as in the game.
const CHARIZARD_ROWS = [
  "...................................................ssk.......",
  ".................................................ksbbask.....",
  "................................................sbbbaabbk....",
  "...............................................kbbbaaabaak...",
  "........................................ask..kkbbbaaaaaaksk..",
  ".......................................sbbbkkbbbbaaaaaakksg..",
  ".....................................ksbbbaaaaaaaaaaaakssag..",
  "...................................ksbbbaaaabbbkaaaaaaasssg..",
  ".................................ksbbbaaaabbbbbakaaaaasskg...",
  ".............................kkksbbaaaaabbbaaaaakaaaaaskbg...",
  ".......................kkkkssbbbbaaaaaabbbaaaaskkaaaasggng...",
  ".....................ksbbbbbbbaaaaaaaaabaaaaakkgkaaasg..g....",
  "....................saaaaaaaaaaaaaaaaaaaaaakkbngaaasg........",
  "....................kaaassssskasaasaaaaaakkkbnnkaasg.........",
  "................kk...kkgggggggskaskaaaaaaaaknnkaaag..........",
  "...............kbbg..........gksgkaaaaaaaaakkaaaask..........",
  "...............kbsg...........gkaaaaaaaaaaaaaaaaag....k......",
  "..............kbasg........kssbaaaaaaaaaaaaaaaaasgks.knk.....",
  "..............kbask......ksbbbaaaaaasaaaaaaaaaasgkuggkbg.s...",
  ".............kaasg.....ksbbbaaaasssssaaaaaaaaaasguuuuukggng..",
  "............ksaasg....kbbbaassskggggksaaaaaaasssguaaauuknng..",
  "............kaaakk....kkaaaakgggaaassssaaaaassskkkkaaaakggkg.",
  "...........kbbaakg.....kgggg....kaaasssaaasssssksskgggggsssg.",
  "...........abaaasg..............kbaaaaaaaasskgssaassssssssskb",
  "..........kbaaasak..............kbbaaaaaasskbbgssssaaassskg..",
  "..........abaaask...............kbaaaaaaaskbbbgsassskkggg....",
  ".........kbaaasak..............kbbbaaaaaaskbbaagggggg........",
  "........kbbaaasak..............kbbaaaaaasskbbaakg............",
  "........kbaaaaskb.............kbbbbaaaaaaaskbaaag............",
  ".......kbbsaaask..............kbbbaaaaaaaskkbaaakk...........",
  ".......kbasaassk.............kbbbbaaaaassakkbaaakak..........",
  ".......sasaaask..............kbbbaaaaaasaskkbaaaaaak.........",
  "......kaasaaasg.............kbbbbaaaaasaakbkbaaaaaabkk.......",
  "......kakaaassg.............kbbboaaaaassaknkbaaaaaaabak......",
  ".....kaasaaakag............kbbbbaaaaasaaskkbbaaaakaaabs......",
  ".....kakaaaaksk...........kbbbbaaaaaasasknkbbaaaksaaaaag.....",
  "....kaasaaaaakk..........kbbbbbaaaaasssskkbbbaaaksaaaaak.....",
  "....kakaaaaaaak..........sbbbboaaaaasasskkbbbbaksssaaaask....",
  "...kaasaaaaaasak........kbbbbaaaaaaasaskkabbbaakssaaaaaag....",
  "...kakaaaaaaassg.......kbbbbaaaaaaassasgabbbaaakssaaaaaak....",
  "...kasaaaaaaaask......kbbbbaaaaaaassasgaabbbaaakssaaaaaasg...",
  "..gakaaaaaaasak......sbbbbaaaaaaassskgaabbbbaaakssaaaaaaak...",
  "..gakaaaaaaassg.....kbbbbaaaaaasaskgaaabbbbaaaksssaaaaaaasg..",
  ".gskaaaaaaassak....kbbbbaaaaaaskggaaaabbbbbaaaksssaaaaaaaag..",
  ".gskaaaaaaasak....kbbbbbaaaasskaaaaaaabbbbbaaaksssaaaaaaaak..",
  "sskaaaaaaaassg..gkbbbbbaaaaskkaaaaaaabbbbbaaaaksasaaaaaaaasg.",
  "kskaaaaaaaasgggkbbbbbbbaaaskaaaaaaaabbbbbbaaakssaaaaaaaaaaag.",
];

export const STAGES = [
  null, // 0: Charmander, the baked art (gameboyArt.js MonArt)
  // `centre`: the body's centre column, placed where Charmander's body stands.
  { name: "CHARMELEON", slug: "charmeleon", centre: 22, rows: CHARMELEON_ROWS },
  { name: "CHARIZARD", slug: "charizard", centre: 39, rows: CHARIZARD_ROWS },
];
