"use client";
import { MenuLine, menuLineClass } from "./icons";

// Menu toggle variants only the nav lab (/lab/nav) uses, kept out of
// ./icons.js so the site nav doesn't ship them.

// "Classic" menu icon variant (/lab/nav): three equal 2px lines, 6px apart.
// Opening: the middle line fades while the outer two meet in the middle, then
// they rotate into an X. Same timing as MenuIcon, instant with reduced motion.
const CLASSIC_LINE_OFFSET = 6;

export function ClassicMenuIcon({ open }) {
  return (
    <span
      aria-hidden="true"
      data-open={open ? "" : undefined}
      className="relative block h-[22px] w-[22px]"
    >
      <MenuLine y={-CLASSIC_LINE_OFFSET} turn={45} open={open} />
      <span
        className={`${menuLineClass} menu-line-fade rounded-full bg-current`}
        style={{ opacity: open ? 0 : 1 }}
      />
      <MenuLine y={CLASSIC_LINE_OFFSET} turn={-45} open={open} />
    </span>
  );
}

// "Label" menu toggle variant (/lab/nav): the words "Menu" and "Close" stacked
// in one grid cell (so the button keeps the wider word's width) and
// crossfaded. Opacity only, so reduced motion keeps the fade, just shorter.
// The hidden word is aria-hidden, so the button's accessible name is the
// visible word.
export function MenuLabel({ open }) {
  return (
    <span className="grid type-small">
      {[
        ["Menu", !open],
        ["Close", open],
      ].map(([word, shown]) => (
        <span
          key={word}
          aria-hidden={shown ? undefined : "true"}
          style={{ opacity: shown ? 1 : 0 }}
          className="menu-label-word text-center [grid-area:1/1]"
        >
          {word}
        </span>
      ))}
    </span>
  );
}
