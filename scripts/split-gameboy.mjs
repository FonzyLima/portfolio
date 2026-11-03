#!/usr/bin/env node
/**
 * Derives structured, animatable assets from the flat Figma export
 * `public/gameboy.svg` (which itself is left untouched: it's the source of
 * truth, and the /lab GameboyStill demo renders it as-is).
 *
 * Outputs
 *   public/gameboy/layered.svg            Full frame, regrouped into named layers:
 *                                         bezel, screen-bg, scanlines, ground,
 *                                         status (> hp-fill, exp), mon (> mon-flame),
 *                                         dialog-panel, dialog-border, dialog-text, logo.
 *                                         The stale `image0` screenshot is dropped and
 *                                         the logo bitmap is downscaled (LOGO_WIDTH).
 *   public/gameboy/base.svg               Same as layered.svg minus the animated
 *                                         layers (status, mon). Rendered as <Image>.
 *   components/gameboy/gameboyArt.js      The animated layers as JSX, plus measured
 *                                         geometry (screen, panel, text line boxes...).
 *
 * Layer membership was mapped once against a Figma export of the same frame
 * that carries layer names. The rules below reproduce that mapping from
 * fills and document order alone, so the derivation runs from the repo.
 * Pass `--verify-map <figma-export.svg>` to re-check every element against the
 * Figma groups (fails on any mismatch).
 *
 * Usage: node scripts/split-gameboy.mjs [--verify-map path/to/figma.svg]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/gameboy.svg");
const OUT_DIR = path.join(ROOT, "public/gameboy");
const OUT_LAYERED = path.join(OUT_DIR, "layered.svg");
const OUT_BASE = path.join(OUT_DIR, "base.svg");
const OUT_JSX = path.join(ROOT, "components/gameboy/gameboyArt.js");

const ANIMATED_LAYERS = new Set(["status", "mon"]);

// The export embeds the "GAME BOY ADVANCE SP" logo as a 2560px-wide PNG, but it's
// drawn ~417 of the 960 viewBox units wide: about 295 CSS px at the largest hero
// size (680px), so 900px covers a 3x screen. See shrinkImage().
const LOGO_WIDTH = 900;

/* ------------------------------------------------------------------ */
/* Minimal XML parsing / serialising (Figma exports are well-formed,   */
/* attribute values never contain ">" and there is no text content).   */
/* ------------------------------------------------------------------ */

function parse(src) {
  const root = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  const re = /<(\/?)([a-zA-Z][\w:.-]*)((?:\s+[^\s=>/]+="[^"]*")*)\s*(\/?)>/g;
  let m;
  while ((m = re.exec(src))) {
    const [, close, tag, attrStr, selfClose] = m;
    if (close) {
      stack.pop();
      continue;
    }
    const attrs = {};
    for (const a of attrStr.matchAll(/([^\s=]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    const node = { tag, attrs, children: [] };
    stack.at(-1).children.push(node);
    if (!selfClose) stack.push(node);
  }
  return root.children[0];
}

const el = (tag, attrs, children = []) => ({ tag, attrs, children });

function toSvg(node, depth = 0) {
  const attrs = Object.entries(node.attrs)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join("");
  if (!node.children.length) return `<${node.tag}${attrs}/>`;
  const inner = node.children.map((c) => toSvg(c, depth + 1)).join("\n");
  return `<${node.tag}${attrs}>\n${inner}\n</${node.tag}>`;
}

/* ------------------------------------------------------------------ */
/* Classification                                                      */
/* ------------------------------------------------------------------ */

const fillOf = (n) => n.attrs.fill || "";
const isRect = (n) => n.tag === "rect";
const num = (v) => (v === undefined ? 0 : parseFloat(v));

/** Children of the outer (bezel) clip group. */
function classifyOuter(node) {
  if (node.tag === "g" && /filter0/.test(node.attrs.filter || "")) return "DROP"; // image0 screenshot
  if (node.tag === "g" && /clip1/.test(node.attrs["clip-path"] || "")) return "SCREEN";
  if (/pattern1/.test(fillOf(node))) return "logo";
  if (node.tag === "mask" && /mask0/.test(node.attrs.id || "")) return "logo";
  if (node.tag === "g" && /mask0/.test(node.attrs.mask || "")) return "logo";
  return "bezel";
}

/** Children of the screen clip group, in document order (layers are contiguous runs). */
function classifyScreen(children) {
  let layer = null;
  let afterPanel = false;
  return children.map((n) => {
    if (isRect(n) && fillOf(n) === "white" && n.attrs.width === "835") layer = "screen-bg";
    else if (n.tag === "g" && n.attrs.opacity === "0.5") layer = "scanlines";
    else if (layer === "scanlines" && isRect(n) && fillOf(n) === "#E1E2E2") layer = "ground";
    else if (layer === "ground" && isRect(n) && fillOf(n) === "#43695C") layer = "status";
    else if (layer === "status" && isRect(n) && fillOf(n) === "#E98E3D") layer = "mon";
    else if (isRect(n) && fillOf(n) === "#1F3236") {
      layer = "dialog-panel";
      afterPanel = true;
      return layer;
    } else if (afterPanel && layer === "dialog-panel") layer = "dialog-border";
    if (layer === "dialog-border" && n.tag === "path" && fillOf(n) === "black" && n.attrs.d.length > 20000)
      layer = "dialog-text";
    if (!layer) throw new Error(`Unclassified screen element <${n.tag}> ${JSON.stringify(n.attrs).slice(0, 120)}`);
    return layer;
  });
}

/** Sub-layers inside status / mon. */
function subLayer(layer, n, state) {
  if (layer === "status") {
    if (isRect(n) && fillOf(n) === "#7DF39D") return "hp-fill";
    if (isRect(n) && fillOf(n) === "#EBCE4B" && n.attrs.width === "3.48598" && n.attrs.height === "4.97998")
      return "exp";
  }
  if (layer === "mon") {
    const FLAME = new Set(["#F3A33B", "#DC682A", "#833E1D"]);
    if (!state.flameDone && isRect(n) && fillOf(n) === "#F3A33B") state.inFlame = true;
    if (state.inFlame && !FLAME.has(fillOf(n))) {
      state.inFlame = false;
      state.flameDone = true;
    }
    if (state.inFlame) return "mon-flame";
  }
  return null;
}

/** Wrap contiguous runs of sub-layer members in groups. */
function groupRuns(layer, nodes) {
  const out = [];
  const state = {};
  let run = null;
  for (const n of nodes) {
    const sub = subLayer(layer, n, state);
    if (!sub) {
      run = null;
      out.push(n);
      continue;
    }
    if (!run || run.attrs.id !== sub) {
      if (out.some((o) => o.attrs?.id === sub)) throw new Error(`Sub-layer ${sub} is not contiguous`);
      run = el("g", { id: sub }, []);
      out.push(run);
    }
    run.children.push(n);
  }
  // EXP dots are exported out of order; sort them left to right so a stagger fills them in order.
  const exp = out.find((o) => o.attrs?.id === "exp");
  if (exp) exp.children.sort((a, b) => num(a.attrs.x) - num(b.attrs.x));
  return out;
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

function transformPoint(t, [x, y]) {
  if (!t) return [x, y];
  let m;
  if ((m = t.match(/^matrix\(([^)]+)\)$/))) {
    const [a, b, c, d, e, f] = m[1].trim().split(/[\s,]+/).map(Number);
    return [a * x + c * y + e, b * x + d * y + f];
  }
  if ((m = t.match(/^rotate\(([^)]+)\)$/))) {
    const [deg, cx = 0, cy = 0] = m[1].trim().split(/[\s,]+/).map(Number);
    const r = (deg * Math.PI) / 180;
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * Math.cos(r) - dy * Math.sin(r), cy + dx * Math.sin(r) + dy * Math.cos(r)];
  }
  throw new Error(`Unsupported transform ${t}`);
}

function rectBox(n) {
  const x = num(n.attrs.x);
  const y = num(n.attrs.y);
  const w = num(n.attrs.width);
  const h = num(n.attrs.height);
  const pts = [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ].map((p) => transformPoint(n.attrs.transform, p));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

function unionBox(nodes) {
  const box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
  const visit = (n) => {
    if (n.tag === "g") return n.children.forEach(visit);
    if (n.tag !== "rect") return;
    const b = rectBox(n);
    box.x0 = Math.min(box.x0, b.x0);
    box.y0 = Math.min(box.y0, b.y0);
    box.x1 = Math.max(box.x1, b.x1);
    box.y1 = Math.max(box.y1, b.y1);
  };
  nodes.forEach(visit);
  return box;
}

/** Vertices of an absolute M/L/H/V/C/Z path (all the Figma glyph outlines use). */
function pathPoints(d) {
  const toks = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g);
  const pts = [];
  let x = 0;
  let y = 0;
  let cmd = null;
  let i = 0;
  while (i < toks.length) {
    if (/[A-Za-z]/.test(toks[i])) {
      cmd = toks[i++];
      if (cmd === "Z") continue;
    }
    if (cmd === "M" || cmd === "L") [x, y] = [+toks[i++], +toks[i++]];
    else if (cmd === "H") x = +toks[i++];
    else if (cmd === "V") y = +toks[i++];
    else if (cmd === "C") {
      i += 4;
      [x, y] = [+toks[i++], +toks[i++]];
    } else throw new Error(`Unsupported path command ${cmd} in dialog text`);
    pts.push([x, y]);
  }
  return pts;
}

/** Cluster glyph vertices into text lines (lines are ~35 units apart, glyphs ~27 tall). */
function measureTextLines(d) {
  const pts = pathPoints(d).sort((a, b) => a[1] - b[1]);
  const lines = [];
  for (const [x, y] of pts) {
    const cur = lines.at(-1);
    if (cur && y - cur.y1 < 5) {
      cur.y1 = Math.max(cur.y1, y);
      cur.x0 = Math.min(cur.x0, x);
      cur.x1 = Math.max(cur.x1, x);
    } else lines.push({ x0: x, x1: x, y0: y, y1: y });
  }
  return lines;
}

const r2 = (v) => Math.round(v * 100) / 100;

/* ------------------------------------------------------------------ */
/* Embedded bitmaps                                                    */
/* ------------------------------------------------------------------ */

/**
 * Re-encodes an embedded PNG <image> at most `maxWidth` px wide (lossless PNG,
 * so the logo's hard edges and alpha mask stay clean). The <image> keeps its
 * user-space width/height, so the pattern transforms that place it don't change;
 * preserveAspectRatio="none" maps the smaller bitmap onto exactly that box
 * (the rounding of the new height distorts it by < 0.2%).
 */
async function shrinkImage(node, maxWidth) {
  const m = (node.attrs["xlink:href"] || "").match(/^data:image\/png;base64,(.+)$/);
  if (!m) throw new Error(`Expected an embedded PNG in <image id="${node.attrs.id}">`);
  const src = Buffer.from(m[1], "base64");
  const { width } = await sharp(src).metadata();
  if (width <= maxWidth) return;
  const png = await sharp(src)
    .resize({ width: maxWidth, kernel: "lanczos3" })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
  const attrs = { ...node.attrs };
  delete attrs["xlink:href"]; // re-added last so attribute order stays id, size, href
  node.attrs = { ...attrs, preserveAspectRatio: "none", "xlink:href": `data:image/png;base64,${png.toString("base64")}` };
}

/* ------------------------------------------------------------------ */
/* JSX emit                                                            */
/* ------------------------------------------------------------------ */

const JSX_ATTR = {
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "color-interpolation-filters": "colorInterpolationFilters",
  "flood-opacity": "floodOpacity",
  "flood-color": "floodColor",
  "xlink:href": "href",
};

function toJsx(node, ids, depth) {
  const pad = "  ".repeat(depth);
  const attrs = Object.entries(node.attrs)
    .map(([k, v]) => {
      if (k === "id") return ` data-layer="${v}"`;
      if (k === "style") throw new Error("style attr not supported in JSX emit");
      const name = JSX_ATTR[k] || k;
      return ` ${name}="${v.replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${ids(id)})`)}"`;
    })
    .join("");
  if (!node.children.length) return `${pad}<${node.tag}${attrs} />`;
  const inner = node.children.map((c) => toJsx(c, ids, depth + 1)).join("\n");
  return `${pad}<${node.tag}${attrs}>\n${inner}\n${pad}</${node.tag}>`;
}

function filterToJsx(node, newId, depth) {
  const copy = structuredClone(node);
  copy.attrs.id = newId;
  const render = (n, d) => {
    const pad = "  ".repeat(d);
    const attrs = Object.entries(n.attrs)
      .map(([k, v]) => ` ${JSX_ATTR[k] || k}="${v}"`)
      .join("");
    if (!n.children.length) return `${pad}<${n.tag}${attrs} />`;
    return `${pad}<${n.tag}${attrs}>\n${n.children.map((c) => render(c, d + 1)).join("\n")}\n${pad}</${n.tag}>`;
  };
  return render(copy, depth);
}

/* ------------------------------------------------------------------ */
/* Optional verification against the named Figma export                */
/* ------------------------------------------------------------------ */

function verifyAgainstFigma(figmaPath, layeredSvg) {
  const drawables = (node, anc = [], out = []) => {
    for (const c of node.children) {
      if (["defs", "mask", "clipPath"].includes(c.tag)) continue;
      if (c.tag === "svg") drawables(c, anc, out);
      else if (c.tag === "g") drawables(c, [...anc, c], out);
      else out.push({ node: c, anc });
    }
    return out;
  };
  const key = (d) =>
    [d.node.tag, fillOf(d.node).replace(/_\d+_\d+/, "").replace(/pattern\d+/, "pattern"), d.node.attrs.width, d.node.attrs.height].join("|");
  const figmaLayer = (d) => {
    const ids = d.anc.map((a) => a.attrs.id).filter(Boolean);
    const id = d.node.attrs.id || "";
    if (ids.includes("Group 67016")) return "scanlines";
    if (ids.includes("Group 67029")) return "ground";
    if (ids.includes("Group 67012")) {
      if (id === "Rectangle 16602") return "hp-fill";
      if (ids.includes("Group 66970")) return "exp";
      return "status";
    }
    if (ids.includes("Group 67013")) return ids.includes("Group 66950") ? "mon-flame" : "mon";
    if (ids.includes("Group 67048")) return "dialog-panel";
    if (ids.includes("Group 67051")) return "dialog-border";
    if (id.startsWith("Lorem ipsum")) return "dialog-text";
    if (ids.includes("Logo")) return "logo";
    if (ids.includes("Frame 32")) return "screen-bg";
    if (ids.includes("Screen_2")) return "DROP";
    return "bezel";
  };
  const ourLayer = (d) => {
    const ids = d.anc.map((a) => a.attrs.id).filter(Boolean);
    return ids.at(-1) || "?";
  };
  const fig = drawables(parse(fs.readFileSync(figmaPath, "utf8")));
  const ours = drawables(parse(layeredSvg));
  // Figma export has extra page/backdrop elements; align greedily by tag/fill/size.
  let j = 0;
  let mismatches = 0;
  let maxDy = 0;
  for (const d of ours) {
    while (j < fig.length && key(fig[j]) !== key(d)) {
      if (figmaLayer(fig[j]) !== "bezel" && figmaLayer(fig[j]) !== "DROP")
        throw new Error(`Figma element skipped during alignment: ${key(fig[j])}`);
      j++;
    }
    if (j === fig.length) throw new Error(`No Figma counterpart for ${key(d)}`);
    const f = fig[j++];
    const want = figmaLayer(f);
    const got = ourLayer(d);
    if (want !== got) {
      mismatches++;
      console.error(`  mismatch: ${key(d)} -> ours=${got} figma=${want}`);
    }
    if (d.node.attrs.y && f.node.attrs.y) maxDy = Math.max(maxDy, Math.abs(num(d.node.attrs.y) - num(f.node.attrs.y) - 0.9736));
  }
  console.log(`verify: ${ours.length} elements checked against Figma groups, ${mismatches} mismatches, max y-offset deviation ${maxDy.toFixed(4)}`);
  if (mismatches) process.exit(1);
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

const svg = parse(fs.readFileSync(SRC, "utf8"));
const [outerClip, defs] = svg.children;
if (outerClip.tag !== "g" || defs.tag !== "defs") throw new Error("Unexpected gameboy.svg structure");

const layers = new Map(); // id -> nodes
const push = (id, n) => (layers.get(id) || layers.set(id, []).get(id)).push(n);

let screenGroup = null;
for (const n of outerClip.children) {
  const c = classifyOuter(n);
  if (c === "DROP") continue;
  if (c === "SCREEN") {
    screenGroup = n;
    classifyScreen(n.children).forEach((layer, i) => push(layer, n.children[i]));
  } else push(c, n);
}

const SCREEN_ORDER = ["screen-bg", "scanlines", "ground", "status", "mon", "dialog-panel", "dialog-border", "dialog-text"];
const layerGroup = (id) => el("g", { id }, ANIMATED_LAYERS.has(id) ? groupRuns(id, layers.get(id)) : layers.get(id));

// Defs: drop the stale screenshot (image0) and everything only it used (pattern0, filter0).
const keptDefs = defs.children.filter((d) => !/^(image0|pattern0$|filter0)/.test(d.attrs.id));
for (const img of keptDefs.filter((d) => d.tag === "image")) await shrinkImage(img, LOGO_WIDTH);
const usedIn = (nodes) => {
  const s = JSON.stringify(nodes);
  return (d) => s.includes(`url(#${d.attrs.id})`);
};

function buildSvg({ skip = new Set() } = {}) {
  const screenLayers = SCREEN_ORDER.filter((id) => !skip.has(id)).map(layerGroup);
  const body = [
    layerGroup("bezel"),
    el("g", { id: "screen", "clip-path": screenGroup.attrs["clip-path"] }, screenLayers),
    layerGroup("logo"),
  ];
  const isUsed = usedIn(body);
  const isClip = (d) => d.tag === "clipPath";
  const isImage1 = (d) => d.tag === "image";
  const defsOut = keptDefs.filter((d) => isClip(d) || isImage1(d) || isUsed(d));
  return el("svg", { ...svg.attrs }, [el("g", { "clip-path": outerClip.attrs["clip-path"] }, body), el("defs", {}, defsOut)]);
}

const layered = buildSvg();
const base = buildSvg({ skip: ANIMATED_LAYERS });

fs.mkdirSync(OUT_DIR, { recursive: true });
const header = (what) =>
  `<!-- Generated by scripts/split-gameboy.mjs from public/gameboy.svg (${what}). Do not edit by hand. -->\n`;
const layeredSvg = toSvg(layered) + "\n";
fs.writeFileSync(OUT_LAYERED, header("all layers") + layeredSvg);
fs.writeFileSync(OUT_BASE, header("static layers only; status and mon are inlined by components/gameboy") + toSvg(base) + "\n");

/* --- geometry ----------------------------------------------------- */
const screenRect = layers.get("screen-bg")[0].attrs;
const panel = layers.get("dialog-panel")[0].attrs;
const textPath = layers.get("dialog-text")[0].attrs.d;
const textLines = measureTextLines(textPath);
const monGroup = layerGroup("mon");
const statusGroup = layerGroup("status");
const monBox = unionBox(monGroup.children);
const flameBox = unionBox(monGroup.children.filter((c) => c.attrs.id === "mon-flame"));
const statusBox = unionBox(statusGroup.children);
const hpBox = unionBox(statusGroup.children.filter((c) => c.attrs.id === "hp-fill"));
const expCount = statusGroup.children.find((c) => c.attrs.id === "exp").children.length;

const geometry = {
  viewBox: svg.attrs.viewBox,
  width: num(svg.attrs.width),
  height: num(svg.attrs.height),
  screen: { x: num(screenRect.x), y: num(screenRect.y), width: num(screenRect.width), height: num(screenRect.height), rx: num(screenRect.rx) },
  panelTop: num(panel.y),
  mon: { x0: r2(monBox.x0), y0: r2(monBox.y0), x1: r2(monBox.x1), y1: r2(monBox.y1) },
  flame: { x0: r2(flameBox.x0), y0: r2(flameBox.y0), x1: r2(flameBox.x1), y1: r2(flameBox.y1) },
  status: { x0: r2(statusBox.x0), y0: r2(statusBox.y0), x1: r2(statusBox.x1), y1: r2(statusBox.y1) },
  hpFill: { x0: r2(hpBox.x0), y0: r2(hpBox.y0), x1: r2(hpBox.x1), y1: r2(hpBox.y1) },
  expCount,
  // Glyph bounding boxes of the baked dialog text, one per line (outline vertices, so exact).
  textLines: textLines.map((l) => ({ x0: r2(l.x0), y0: r2(l.y0), x1: r2(l.x1), y1: r2(l.y1) })),
};

/* --- JSX ---------------------------------------------------------- */
const usedFilters = keptDefs.filter((d) => d.tag === "filter" && usedIn([monGroup, statusGroup])(d));
const filterIds = new Map(usedFilters.map((f) => [f.attrs.id, `gb-${f.attrs.id.replace(/_\d+_\d+$/, "").replace(/_/g, "-")}`]));
const ids = (id) => {
  if (!filterIds.has(id)) throw new Error(`Animated layer references unknown def #${id}`);
  return filterIds.get(id);
};
const children = (g) => g.children.map((c) => toJsx(c, ids, 3)).join("\n");

const jsx = `// AUTO-GENERATED by scripts/split-gameboy.mjs from public/gameboy.svg. Do not edit by hand.
// Animated layers of the Game Boy battle screen. The static layers live in
// public/gameboy/base.svg and are drawn underneath with the same viewBox.

export const GEOMETRY = ${JSON.stringify(geometry, null, 2)};

/** Drop/inner-shadow filters used by the status box. */
export function ArtDefs() {
  return (
    <>
${usedFilters.map((f) => filterToJsx(f, filterIds.get(f.attrs.id), 3)).join("\n")}
    </>
  );
}

/** Status box. Contains <g data-layer="hp-fill"> and <g data-layer="exp"> (dots sorted left to right). */
export function StatusArt() {
  return (
    <>
${children(statusGroup)}
    </>
  );
}

/** Charmander back sprite. Contains <g data-layer="mon-flame">. */
export function MonArt() {
  return (
    <>
${children(monGroup)}
    </>
  );
}
`;
fs.mkdirSync(path.dirname(OUT_JSX), { recursive: true });
fs.writeFileSync(OUT_JSX, jsx);

const kb = (f) => `${(fs.statSync(f).size / 1024).toFixed(1)} KB`;
console.log(`layers: ${[...layers.keys()].map((k) => `${k}(${layers.get(k).length})`).join(", ")}`);
console.log(`wrote ${path.relative(ROOT, OUT_LAYERED)} ${kb(OUT_LAYERED)}`);
console.log(`wrote ${path.relative(ROOT, OUT_BASE)} ${kb(OUT_BASE)}`);
console.log(`wrote ${path.relative(ROOT, OUT_JSX)} ${kb(OUT_JSX)}`);
console.log(`text lines: ${geometry.textLines.map((l) => `[${l.x0}-${l.x1} x ${l.y0}-${l.y1}]`).join(" ")}`);
console.log(`mon ${JSON.stringify(geometry.mon)} flame ${JSON.stringify(geometry.flame)} status ${JSON.stringify(geometry.status)} exp dots ${expCount}`);

const mapIdx = process.argv.indexOf("--verify-map");
if (mapIdx !== -1) verifyAgainstFigma(process.argv[mapIdx + 1], layeredSvg);
