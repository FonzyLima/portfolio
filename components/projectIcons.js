import {
  SiCsharp,
  SiCss3,
  SiDiscord,
  SiDjango,
  SiFigma,
  SiFirebase,
  SiGithub,
  SiItchdotio,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiUnity,
  SiVercel,
} from "react-icons/si";
import {
  LuBot,
  LuCode,
  LuFolder,
  LuGamepad2,
  LuGlobe,
  LuMonitorSmartphone,
  LuPalette,
  LuSmartphone,
  LuWebhook,
} from "react-icons/lu";

// Icons for the "Icons" tag style on project cards (tried at /lab/cards).
// Tools are matched by name, case-insensitively; anything unknown gets a
// generic code glyph, so new Sanity tools never break the card.
const TOOL_ICONS = {
  "next.js": SiNextdotjs,
  "tailwind css": SiTailwindcss,
  vercel: SiVercel,
  unity: SiUnity,
  "c#": SiCsharp,
  "itch.io": SiItchdotio,
  css: SiCss3,
  python: SiPython,
  "discord.py": SiDiscord,
  github: SiGithub,
  react: SiReact,
  "react native": SiReact,
  django: SiDjango,
  figma: SiFigma,
  firebase: SiFirebase,
  typescript: SiTypescript,
  "node.js": SiNodedotjs,
  openai: SiOpenai,
  "rest apis": LuWebhook,
  "responsive ui": LuMonitorSmartphone,
  "ui design": LuPalette,
};

const CATEGORY_ICONS = {
  website: LuGlobe,
  "mobile app": LuSmartphone,
  game: LuGamepad2,
  bot: LuBot,
};

export function ToolIcon({ tool, className }) {
  const Icon = TOOL_ICONS[(tool ?? "").toLowerCase()] ?? LuCode;
  return <Icon aria-hidden="true" className={className} />;
}

export function CategoryIcon({ category, className }) {
  const Icon = CATEGORY_ICONS[(category ?? "").toLowerCase()] ?? LuFolder;
  return <Icon aria-hidden="true" className={className} />;
}
