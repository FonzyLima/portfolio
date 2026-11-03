"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CAP_ROWS, textPath, textWidth } from "./pixelFont";
import { scrollToAnchor } from "../../src/app/lib/scrollToAnchor";

/**
 * "Press A" battle menu for the Game Boy hero.
 *
 * Closed: one transparent button over the dialog box (the whole box is the A
 * button, so it's a 44px+ target even on the 272px mobile render). Pressing the
 * A key while the hero is in view does the same.
 *
 * Open: the baked dialog text is covered and a FireRed-style action menu is
 * drawn in the same pixel style: "WHAT WILL ALFONSO DO?" on the left and a 2x2
 * grid (PROJECTS / ABOUT / SKILLS / CONTACT) on the right, the selected item
 * marked by a ▶ cursor and an inverted (white on ink) label. The
 * visuals are SVG (so they scale with the viewBox); the semantics are real
 * links in an HTML layer on top. Arrow keys move the cursor, A/Enter select,
 * B/Escape close, and the cursor follows hover and focus.
 *
 * `geometry` (width, height, viewBox of the art) comes from the server wrapper
 * as a prop: importing ./gameboyArt here would put the art in the client bundle.
 */

const pct = (v, of) => `${(v / of) * 100}%`;
const boxIn = ({ width: W, height: H }) => (x0, y0, x1, y1) => ({
  left: pct(x0, W),
  top: pct(y0, H),
  width: pct(x1 - x0, W),
  height: pct(y1 - y0, H),
});

// Dialog box in public/gameboy/base.svg: green frame x 82..880, y 198..395 on the
// #1F3236 panel; white inside x 93..866, y 211..376. Text sits at x 112, lines 35 apart.
export const DIALOG = { x0: 82, y0: 198, x1: 880, y1: 395 };
const INNER = { x0: 96, y0: 214, x1: 864, y1: 374 };
const INK = "#1F3236"; // panel colour, reads like the baked text
const FRAME = "#7DF39D"; // dialog frame green
const PX = 2.75; // font pixel: 7 cap rows ≈ the baked glyphs' 9 rows of ~2.2 units
const CAP_H = CAP_ROWS * PX;

const TEXT_X = 112;
// Mixed case like the game's "What will CHARMANDER do?"
const PROMPT = [
  ["What will", 245],
  ["ALFONSO do?", 280],
];
// FireRed splits the bottom bar into two framed boxes: the text box and the action
// box. The baked art is one box, so a frame seam (green, panel gap, green) is drawn
// between them at this x.
const DIVIDER_X = 500;
const SEAM = { green: 4, gap: 10 };

const ITEMS = [
  { label: "PROJECTS", name: "Projects", href: "/portfolio" },
  { label: "ABOUT", name: "About", href: "/about" },
  { label: "SKILLS", name: "Skills", href: "/about#technical-skills" },
  { label: "CONTACT", name: "Contact", href: "#footer", anchor: true },
];
// 2x2 grid: item i sits at column i % 2, row floor(i / 2).
const COL_X = [545, 715]; // glyph left edges
const ROW_Y = [245, 326]; // glyph top edges
// Hit cells split the whole action box, frame included (seam at DIVIDER_X to the
// right frame edge, top to bottom of the frame), so each is as big as it can be:
// 190 x 98.5 units, about 54 x 28px on the 272px mobile render (>= 24px, WCAG 2.5.8).
// The close button covers the text box up to DIVIDER_X, so there's no dead gap.
const COL_SPLIT = (DIVIDER_X + DIALOG.x1) / 2;
const ROW_SPLIT = (DIALOG.y0 + DIALOG.y1) / 2;
const CELL_X = [
  [DIVIDER_X, COL_SPLIT],
  [COL_SPLIT, DIALOG.x1],
];
const CELL_Y = [
  [DIALOG.y0, ROW_SPLIT],
  [ROW_SPLIT, DIALOG.y1],
];
const col = (i) => i % 2;
const row = (i) => Math.floor(i / 2);

const PROMPT_PATH = PROMPT.map(([text, y]) =>
  textPath(text, TEXT_X, y, PX),
).join("");
const LABEL_PATHS = ITEMS.map((item, i) =>
  textPath(item.label, COL_X[col(i)], ROW_Y[row(i)], PX),
);
// Selected label is inverted: an ink block one font pixel bigger than the label
// on every side, with the label knocked out in white. Pixel-style, and much easier
// to spot than the ▶ alone (it doubles as the links' focus indicator).
const HIGHLIGHTS = ITEMS.map((item, i) => ({
  x: COL_X[col(i)] - PX,
  y: ROW_Y[row(i)] - PX,
  width: textWidth(item.label, PX) + 2 * PX,
  height: CAP_H + 2 * PX,
}));

// ▶ cursor like the game's: a solid triangle as tall as a capital, 4 pixels wide,
// one glyph-width left of the label.
const CURSOR_ROWS = [1, 2, 3, 4, 3, 2, 1];
function cursorPath(i) {
  const x = COL_X[col(i)] - 6 * PX;
  const y = ROW_Y[row(i)] + (CAP_H - CURSOR_ROWS.length * PX) / 2;
  return CURSOR_ROWS.map(
    (w, r) => `M${x} ${y + r * PX}h${w * PX}v${PX}h-${w * PX}z`,
  ).join("");
}

const isEditable = (el) =>
  !!el &&
  (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

// Focus ring for the open/close buttons (they sit on the green frame / dark panel, so
// the hero's two-tone ring). The menu links have no ring: focus follows the
// selection, and the selected item's ▶ cursor plus inverted label (drawn in the SVG)
// *is* the focus indicator, so the screen never shows a web-looking box.
const RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#171717] focus-visible:shadow-[0_0_0_6px_#EBEBEB]";
const LINK_RING = "outline-none";

export default function GameboyMenu({ geometry, ready, inView, open, onOpen, onClose }) {
  const box = boxIn(geometry);
  const [selected, setSelected] = useState(0);
  const rootRef = useRef(null);
  const openButtonRef = useRef(null);
  const linkRefs = useRef([]);
  const wasOpen = useRef(false);
  // False when the menu closes because focus/the pointer went elsewhere (or
  // CONTACT moved focus to the footer): don't pull focus back to the hero then.
  const restoreFocus = useRef(true);

  const closeWithoutFocus = () => {
    restoreFocus.current = false;
    onClose();
  };

  // Keyboard: A opens (hero in view, focus not elsewhere on the page). While open,
  // arrows move the cursor, A activates the selected link, B/Escape close.
  // Shortcuts only apply when nothing else has focus or focus is inside the hero,
  // so they never hijack keys meant for another control (WCAG 2.1.4).
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.repeat || // holding A must not open *and* then activate a link
        event.defaultPrevented || // e.g. ShinyMode consumed the Konami code's final A
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isEditable(event.target)
      )
        return;
      const active = document.activeElement;
      const figure = rootRef.current?.closest("figure") ?? rootRef.current;
      const focusInHero = !!active && !!figure?.contains(active);
      const key = event.key.toLowerCase();
      if (!open) {
        const focusFree = !active || active === document.body;
        if (key === "a" && ready && inView && (focusFree || focusInHero)) {
          event.preventDefault();
          onOpen();
        }
        return;
      }
      if (!rootRef.current?.contains(active)) return;
      if (key === "escape" || key === "b") {
        event.preventDefault();
        onClose();
        return;
      }
      if (key === "a") {
        event.preventDefault();
        linkRefs.current[selected]?.click();
        return;
      }
      const step = {
        arrowleft: (i) => (col(i) > 0 ? i - 1 : i),
        arrowright: (i) => (col(i) < 1 ? i + 1 : i),
        arrowup: (i) => (row(i) > 0 ? i - 2 : i),
        arrowdown: (i) => (row(i) < 1 ? i + 2 : i),
      }[key];
      if (step) {
        event.preventDefault();
        setSelected(step);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, ready, inView, selected, onOpen, onClose]);

  // Click/tap outside the menu, focus moving outside it (Tab away), or the hero
  // scrolling out of view closes it, leaving focus where the user put it.
  useEffect(() => {
    if (!open) return;
    const close = () => {
      restoreFocus.current = false;
      onClose();
    };
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close();
    };
    const onFocusIn = (event) => {
      if (!rootRef.current?.contains(event.target)) close();
    };
    if (!inView) close();
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open, inView, onClose]);

  // Focus follows the cursor while open; on close, focus returns to the A button
  // unless the menu was closed by moving focus elsewhere.
  useEffect(() => {
    if (open) {
      linkRefs.current[selected]?.focus({ preventScroll: true });
    } else if (wasOpen.current) {
      if (restoreFocus.current) {
        openButtonRef.current?.focus({ preventScroll: true });
      }
      restoreFocus.current = true;
    }
    wasOpen.current = open;
  }, [open, selected]);

  return (
    <div ref={rootRef} className="contents">
      {open && (
        <svg
          viewBox={geometry.viewBox}
          className="pointer-events-none absolute inset-0 h-full w-full"
          shapeRendering="crispEdges"
          aria-hidden="true"
          focusable="false"
        >
          <rect
            x={INNER.x0}
            y={INNER.y0}
            width={INNER.x1 - INNER.x0}
            height={INNER.y1 - INNER.y0}
            fill="#fff"
          />
          <path d={PROMPT_PATH} fill={INK} />
          {/* Frame seam between the text box and the action box. */}
          <rect
            x={DIVIDER_X - SEAM.gap / 2 - SEAM.green}
            y={INNER.y0 - 3}
            width={SEAM.gap + SEAM.green * 2}
            height={INNER.y1 - INNER.y0 + 6}
            fill={FRAME}
          />
          <rect
            x={DIVIDER_X - SEAM.gap / 2}
            y={INNER.y0 - 3}
            width={SEAM.gap}
            height={INNER.y1 - INNER.y0 + 6}
            fill={INK}
          />
          <path
            d={LABEL_PATHS.filter((_, i) => i !== selected).join("")}
            fill={INK}
          />
          <rect {...HIGHLIGHTS[selected]} fill={INK} />
          <path d={LABEL_PATHS[selected]} fill="#fff" />
          <path d={cursorPath(selected)} fill={INK} />
        </svg>
      )}

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            style={box(DIALOG.x0, DIALOG.y0, DIVIDER_X, DIALOG.y1)}
            className={`absolute cursor-pointer rounded-lg bg-transparent ${RING}`}
          />
          <nav aria-label="Game Boy menu" className="contents">
            {ITEMS.map((item, i) => {
              const [x0, x1] = CELL_X[col(i)];
              const [y0, y1] = CELL_Y[row(i)];
              const common = {
                ref: (el) => (linkRefs.current[i] = el),
                href: item.href,
                tabIndex: i === selected ? 0 : -1,
                onMouseEnter: () => setSelected(i),
                onFocus: () => setSelected(i),
                style: box(x0, y0, x1, y1),
                className: `absolute cursor-pointer rounded-lg ${LINK_RING}`,
                children: <span className="sr-only">{item.name}</span>,
              };
              return item.anchor ? (
                <a
                  key={item.name}
                  {...common}
                  onClick={(event) => {
                    // scrollToAnchor moves focus to the footer; keep it there.
                    closeWithoutFocus();
                    scrollToAnchor(event, item.href);
                  }}
                />
              ) : (
                <Link key={item.name} {...common} onClick={onClose} />
              );
            })}
          </nav>
        </>
      ) : (
        <button
          ref={openButtonRef}
          type="button"
          aria-label="Open Game Boy menu"
          disabled={!ready}
          onClick={onOpen}
          style={box(DIALOG.x0, DIALOG.y0, DIALOG.x1, DIALOG.y1)}
          className={`absolute rounded-lg bg-transparent ${ready ? "cursor-pointer" : "cursor-default"} ${RING}`}
        />
      )}
    </div>
  );
}
