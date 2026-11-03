// Experiments shown on /experiments, newest first.
//
// To add one: add an entry here. For a demo stage, also add a component in
// components/lab/demos/ and register its key in components/lab/demos/index.js.
// Entries without a `demo` (or with an unknown key) render without a stage.
//
// Fields:
//   id           unique, stable slug
//   title        card heading
//   description  1-2 factual sentences
//   date         "YYYY-MM"
//   tags         short labels
//   demo         key in DEMOS (components/lab/demos/index.js), optional
//   link         { href, label }, optional
export const experiments = [
  {
    id: "gameboy-battle-intro",
    title: "Game Boy battle intro",
    description:
      "A GBA-style Pokémon battle intro on the homepage Game Boy: white flashes, the black bars slide apart, Charmander is sent out, then the HP bar, EXP dots and dialog fill in frame by frame. It plays once when the hero scrolls into view, then settles into 2-frame idle loops that pause off-screen; with reduced motion the finished screen shows straight away.",
    date: "2026-11",
    tags: ["CSS animation", "SVG", "Reduced motion"],
    demo: "gameboy",
    link: { href: "/", label: "See it live" },
  },
  {
    id: "morphing-menu-icon",
    title: "Morphing menu icon",
    description:
      "The mobile menu button's two lines meet in the middle, then rotate into an X while the short line grows to full width, in 240ms. Closing plays the same steps in reverse, and with reduced motion it switches instantly.",
    date: "2026-11",
    tags: ["CSS transitions", "Navigation"],
    demo: "menu-icon",
  },
  {
    id: "sliding-active-indicator",
    title: "Sliding active indicator",
    description:
      "The nav's current-page underline slides from link to link with a FLIP Web Animation (transform only), 240ms ease-in-out. With reduced motion it jumps straight to the new link.",
    date: "2026-11",
    tags: ["Web Animations", "FLIP", "Navigation"],
    demo: "active-indicator",
  },
  {
    id: "theme-icon-crossfade",
    title: "Theme icon crossfade",
    description:
      "The theme toggle's sun and moon crossfade in the same spot, rotating 90° and scaling as they swap in 180ms, or fading only with reduced motion. This preview swaps the icon and leaves the site theme alone.",
    date: "2026-11",
    tags: ["CSS keyframes", "Theming"],
    demo: "theme-icon",
  },
];
