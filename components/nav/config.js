// Constants and class helpers for the site nav (components/Navigation.js).

// Nav items in display order. Route items are active on their path and any
// sub-path (/projects/* -> Projects). Items whose href starts with "#"
// smooth-scroll to that id on the current page.
export const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#footer" },
];

export const MENU_ID = "mobile-menu";
// The nav always shows within this distance of the top of the page.
export const ALWAYS_VISIBLE_ABOVE_Y = 100;
// Scroll distance (px) needed before the hide/show direction can change.
export const SCROLL_THRESHOLD = 8;

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isAnchor = (href) => href.startsWith("#");
export const isActiveRoute = (pathname, href) =>
  !isAnchor(href) && (pathname === href || pathname.startsWith(`${href}/`));

// The ring itself (2px, --focus colour) is global in globals.css; nav items
// only round it and pull it inside the 64px row.
export const focusRing = "rounded-lg";
export const linkClass = (isActive, size = "type-small") =>
  `flex items-center ${size} ${focusRing} focus-visible:outline-offset-[-6px] ${
    isActive ? "text-accent-strong" : "hover:text-fg-muted"
  }`;
export const iconButtonClass = `relative flex h-11 w-11 items-center justify-center hover:text-fg-muted ${focusRing} focus-visible:outline-offset-0`;
