// @type {import('tailwindcss').Config}

// Colour tokens are CSS variables holding RGB channels (src/app/globals.css),
// so they switch with the `dark` class and still accept opacity modifiers.
const v = (n) => `rgb(var(--${n}) / <alpha-value>)`;

module.exports = {
  content: ["src/app/**/*.{js,ts,jsx,tsx}", "components/**/*.{js,ts,jsx,tsx}"],
  darkMode:"class",
  // hover: variants only apply on devices that can hover, so taps on touch
  // screens don't leave a "stuck" hover state behind.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      // The motion eases from globals.css ("Motion"), so `ease-out` /
      // `ease-in-out` match the CSS and components/nav/motion.js.
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      colors: {
        page: v("page"),
        surface: { DEFAULT: v("surface"), raised: v("surface-raised") },
        placeholder: v("placeholder"),
        line: { DEFAULT: v("line"), strong: v("line-strong") },
        fg: { DEFAULT: v("fg"), muted: v("fg-muted") },
        accent: {
          DEFAULT: v("accent"),
          hover: v("accent-hover"),
          strong: v("accent-strong"),
        },
        "on-accent": v("on-accent"),
        focus: v("focus"),
        scrim: v("scrim"),
        "tag-bar": v("tag-bar"),
        "on-tag-bar": v("on-tag-bar"),
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
      },
      fontFamily: {
        // --font-wix is set on <html> by next/font in src/app/layout.js.
        custom: ["var(--font-wix)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
