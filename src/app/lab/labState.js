// Shared by /lab's server page (page.js) and its variant bar (LabClient.js).
// Plain data only: the variant lists themselves come from the section
// components and are read on the server.

// The top row of the bar; `target` is the section's id on the page.
export const sections = [
  { id: "intro", label: "About me", target: "about-intro" },
  { id: "skills", label: "Skills", target: "technical-skills" },
  { id: "resume", label: "Resume", target: "resume" },
];

// Defaults match what /about ships (src/app/about/page.js).
export const defaults = {
  section: "intro",
  intro: "trainer",
  card: "tcg",
  side: "facts",
  badge: "initials",
  layout: "panel",
  chip: "badge",
  resume: "map",
};

// Skill layouts that render SkillChips; Columns and Tiles have their own markup.
export const LAYOUTS_WITH_CHIPS = ["cards", "rows", "panel"];
