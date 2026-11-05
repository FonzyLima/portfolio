// Motion tokens from DESIGN_SYSTEM.md that the nav needs in JS. All nav
// motion stays under 250ms. The same values are CSS custom properties in
// src/app/globals.css ("Motion": --ease-in-out, --motion-move); keep the two
// in sync.

// Strong ease-in-out for on-screen movement, as a CSS / Web Animations
// string. The nav's hide/show slide uses the same curve as a Tailwind
// arbitrary value on <nav>.
export const EASE_IN_OUT_CSS = "cubic-bezier(0.77, 0, 0.175, 1)";
// Indicator slide (ms).
export const MOVE_MS = 240;

// Active-link underline. It sits inside a `relative` span around the label;
// bg-current picks up the link's accent colour in both themes. 3px with fully
// rounded ends (a 2px line is too thin for the radius to read).
export const indicatorClass =
  "pointer-events-none absolute inset-x-0 -bottom-[6px] h-[3px] rounded-full bg-current";
