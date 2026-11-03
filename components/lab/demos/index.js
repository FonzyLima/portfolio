import GameboyStill from "./GameboyStill";
import MenuIconDemo from "./MenuIconDemo";
import ActiveIndicatorDemo from "./ActiveIndicatorDemo";
import ThemeIconDemo from "./ThemeIconDemo";

// Demo stage for each experiment, keyed by `demo` in src/app/data/labData.js.
export const DEMOS = {
  gameboy: GameboyStill,
  "menu-icon": MenuIconDemo,
  "active-indicator": ActiveIndicatorDemo,
  "theme-icon": ThemeIconDemo,
};
