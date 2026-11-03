// Motion tokens from DESIGN_SYSTEM.md, shared by the nav and the Lab demos
// that reuse its pieces. All nav motion stays under 250ms. The same values are
// CSS custom properties in src/app/globals.css ("Motion": --ease-out,
// --ease-in-out, --motion-*); keep the two in sync.

// Strong ease-out: entering/exiting elements.
export const EASE_OUT = [0.23, 1, 0.32, 1];
// Strong ease-in-out: on-screen movement. The nav's hide/show slide uses the
// same curve as a Tailwind arbitrary value on <nav>.
export const EASE_IN_OUT = [0.77, 0, 0.175, 1];
// The same curves as CSS / Web Animations strings.
export const EASE_OUT_CSS = `cubic-bezier(${EASE_OUT.join(", ")})`;
export const EASE_IN_OUT_CSS = `cubic-bezier(${EASE_IN_OUT.join(", ")})`;
export const DURATION = {
  fast: 0.12, // reduced-motion fades, menu items leaving
  base: 0.18, // icon swaps, menu items entering
  move: 0.24, // indicator slide, menu height
};

// Active-link underline. It sits inside a `relative` span around the label;
// bg-current picks up the link's accent colour in both themes. 3px with fully
// rounded ends (a 2px line is too thin for the radius to read).
export const indicatorClass =
  "pointer-events-none absolute inset-x-0 -bottom-[6px] h-[3px] rounded-full bg-current";
