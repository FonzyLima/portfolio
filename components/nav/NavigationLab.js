"use client";
import React from "react";
import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import { indicatorClass } from "./motion";
import { MenuIcon } from "./icons";
import { ClassicMenuIcon, MenuLabel } from "./labIcons";
import DarkContext from "@/app/context/darkContext";
import { scrollToAnchor } from "@/app/lib/scrollToAnchor";
import LogoMark from "../LogoMark";
import ThemeToggle, { THEME_TOGGLE_PULL, themeToggleVariants } from "./ThemeToggle";
import {
  MENU_ID,
  NAV_ITEMS,
  focusRing,
  iconButtonClass,
  isActiveRoute,
  isAnchor,
  linkClass,
} from "./config";
import {
  LinkLabel as SharedLinkLabel,
  LogoContent,
  MenuSocials,
  ThemeButton,
} from "./parts";
import { useMarkerSlide } from "./useMarkerSlide";
import { useNavMenu } from "./useNavMenu";
import { useNavScroll } from "./useNavScroll";

// The nav lab's preview nav (/lab/nav, src/app/lab/nav/NavLab.js): every
// design variant of the site nav. Only NavLab imports this module, so none of
// it ships on the public pages; the site nav (components/Navigation.js) is
// the default variant alone and shares its pieces from this folder
// (config, parts, useNavMenu, useNavScroll, useMarkerSlide). With every prop
// at its default this renders the same markup as the site nav.

// Design variants. The first option of each is the default, which is what
// components/Navigation.js ships.
export const activeVariants = [
  { id: "underline", label: "Underline" },
  { id: "pill", label: "Pill" },
  { id: "dot", label: "Dot" },
];
// The bar itself, as four independent rows. Shapes are grouped for the lab
// bar (bars | pills | edges | minimal); hanging stays first, as the default.
export const shapeVariants = [
  { id: "hanging", label: "Hanging", group: "bars" },
  { id: "full", label: "Full width", group: "bars" },
  { id: "floating", label: "Floating", group: "bars" },
  { id: "island", label: "Island", group: "pills" },
  { id: "split", label: "Split", group: "pills" },
  { id: "notch", label: "Notch", group: "pills" },
  { id: "rail", label: "Rail", group: "edges" },
  { id: "dock", label: "Dock", group: "edges" },
  { id: "corners", label: "Corners", group: "edges" },
  { id: "fab", label: "FAB", group: "minimal" },
];
// Desktop-only shapes: their own layout from md up, the full bar below md
// (dock: docked at the bottom, like Position: Bottom).
export const DESKTOP_ONLY_SHAPES = ["rail", "dock", "corners"];
export const layoutVariants = [
  { id: "right", label: "Right" },
  { id: "center", label: "Center" },
  { id: "stacked", label: "Stacked" },
];
// Layout only applies to these shapes (the lab dims its row for the others).
export const SHAPES_WITH_LAYOUT = ["full", "floating"];
export const surfaceVariants = [
  { id: "glass", label: "Glass" },
  { id: "solid", label: "Solid" },
  { id: "clear", label: "Clear" },
  { id: "inverted", label: "Inverted" },
];
export const scrollVariants = [
  { id: "hide", label: "Hide" },
  { id: "sticky", label: "Sticky" },
  { id: "shrink", label: "Shrink" },
  { id: "progress", label: "Progress" },
];
export const positionVariants = [
  { id: "top", label: "Top" },
  { id: "bottom", label: "Bottom" },
];

// Combination rules (where rows interact):
// - Menu open (phones): every surface goes solid (clear shows its layer),
//   and island/split turn into the floating panel so the menu has a surface.
// - Layout applies to full and floating only; island and split ignore it.
// - Stacked collapses to the standard row past 100px under every Scroll
//   option. With hide it collapses first, then hides on further scrolling;
//   scrolling up shows the collapsed row. With shrink the collapsed row is
//   48px. On phones there's no second tier, only a centred logo.
// - Only hide ever hides the bar; sticky, shrink and progress keep it shown.
// - Shrink doesn't apply to island (already compact).
// - Progress draws inside the bar's surface (the right pill for split), at
//   its top edge while docked at the bottom.
// - Clear and inverted are the same row, so they never combine. Clear on a
//   detached shape fades in the pill's background and shadow together.
// - Inverted swaps the bar to the other theme's tokens (.nav-inverted).
// - Position applies below md only; desktop always sits at the top.
// Shapes added later:
// - Notch and hanging are attached to the top edge (no gap), rounded below:
//   notch rounded-b-full around its content, hanging rounded-b-lg across the
//   container. Hide slides them up into the edge. Position: Bottom attaches
//   them to the bottom edge on phones, rounded above. An open phone menu
//   turns the notch into the hanging panel so the menu has room.
// - Rail, dock and corners are desktop-only. Below md they're the full bar
//   (dock: docked at the bottom, so its Position row is dimmed), and every
//   row applies to that bar as usual.
// - Rail (md+): Scroll doesn't apply (it never hides, shrinks or shows
//   progress; the lab dims the row). Its hairline runs down the right edge.
//   The marker is a vertical bar on the link's left (screen-edge) side and
//   slides vertically.
// - Corners (md+): logo top-left, theme toggle top-right, Work + About
//   bottom-left, Contact bottom-right, each in its own pill (none at the
//   top with clear: the pills fade in past 100px). Hide fades the pieces
//   out. Shrink doesn't apply; progress is a line along the viewport's top.
// - Dock (md+): logo pill top-left, links + theme toggle in a pill at the
//   bottom centre; hovering an item scales just that item to 1.08. Hide
//   slides the pills off their edges. Shrink doesn't apply; progress runs
//   inside the dock pill.
// - FAB (every width): logo pill + a 56px menu button; the button opens a
//   popover with the links, socials and theme toggle, using every rule of
//   the phone menu (also on desktop). Menu and Position don't apply (dimmed),
//   nor do shrink and progress.
// - Pills (split, corners, dock, FAB) each carry the surface; inverted
//   applies to all of them, clear fades each pill in past 100px.
export const menuVariants = [
  { id: "dropdown", label: "Dropdown" },
  { id: "numbered", label: "Numbered" },
  { id: "fullscreen", label: "Full screen" },
];
// Theme toggle variants live with their markup in components/nav/ThemeToggle.js.
export { themeToggleVariants };
export const iconVariants = [
  { id: "morph", label: "Morph" },
  { id: "classic", label: "Classic" },
  { id: "label", label: "Label" },
];

const ISLAND_ID = "nav-island-links";

// Desktop active-link marker (indicatorClass is in ./motion). Every
// desktop link renders one and only the current page's is visible; on a route
// change the new marker plays a FLIP from the old one's box, so it slides
// between links (see useMarkerSlide). Switching styles in the lab doesn't
// slide, so one shape never morphs into another.
const markerClass = {
  underline: indicatorClass,
  // Small dot centred under the label.
  dot: "pointer-events-none absolute left-1/2 -bottom-[10px] -ml-[3px] h-1.5 w-1.5 rounded-full bg-current",
  // Accent pill behind the label, out to the link's 12px padding.
  pill: "pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-full bg-accent",
  pillLarge: "pointer-events-none absolute -inset-x-3 -inset-y-1 rounded-full bg-accent",
};

// Mobile menu motion is CSS (.nav-dropdown, .nav-sheet, .nav-menu-item and
// .nav-scrim in src/app/globals.css): the dropdown's height opens ease-out and
// the links stagger in 30ms apart (--i is each item's index); on close the
// links fade first while the height starts slowly (ease-in-out). The sheet
// fades. Reduced motion is an opacity-only fade with no height, slide or
// stagger. The menus stay mounted and are `inert` while closed.

// The shared LinkLabel with the `active` variant's marker. The pill sits
// behind the text; `large` is the mobile menus' bigger pill.
function LinkLabel({ variant, large, ...props }) {
  return (
    <SharedLinkLabel
      {...props}
      markerClass={variant === "pill" && large ? markerClass.pillLarge : markerClass[variant]}
      behind={variant === "pill"}
    />
  );
}

export default function NavigationLab({
  // Only set by /lab/nav. Route links don't navigate in preview; they move
  // the current-page marker instead, so the active styles can be compared.
  preview = false,
  active = activeVariants[0].id,
  shape = shapeVariants[0].id,
  layout = layoutVariants[0].id,
  surface = surfaceVariants[0].id,
  scroll = scrollVariants[0].id,
  menu = menuVariants[0].id,
  icon = iconVariants[0].id,
  position = positionVariants[0].id,
  theme = themeToggleVariants[0].id,
}) {
  const [isDark, setisDark] = useContext(DarkContext);
  const isFab = shape === "fab";
  // Menu open state, Escape/outside/blur closing and focus return, deferred
  // anchor scroll: shared with the site nav. FAB's popover stays open past md.
  const {
    pathname,
    showMenu,
    setShowMenu,
    navRef,
    toggleRef,
    firstMenuLinkRef,
    deferAnchor,
    onMenuBlur,
    onToggleClick,
  } = useNavMenu({ closeOnDesktop: !isFab });
  // isPastTop (past 100px) drives the clear, shrink and stacked variants.
  const { isScrolledAway, isPastTop, revealNav } = useNavScroll();
  const [previewPath, setPreviewPath] = useState("/portfolio");
  const desktopListRef = useRef(null);
  // Island (desktop): open while hovered, keyboard-focused or pinned by its
  // Menu trigger; Escape dismisses it until the pointer or focus moves on.
  const [islandHover, setIslandHover] = useState(false);
  const [islandFocus, setIslandFocus] = useState(false);
  const [islandPinned, setIslandPinned] = useState(false);
  const [islandDismissed, setIslandDismissed] = useState(false);
  const islandTriggerRef = useRef(null);

  const currentPath = preview ? previewPath : pathname;
  const isFull = shape === "full";
  const isIsland = shape === "island";
  const isSplit = shape === "split";
  const isNotch = shape === "notch";
  const isHanging = shape === "hanging";
  const isRail = shape === "rail";
  const isCorners = shape === "corners";
  const isDock = shape === "dock";
  const desktopOnly = DESKTOP_ONLY_SHAPES.includes(shape);
  const usesLayout = SHAPES_WITH_LAYOUT.includes(shape);
  const isCenter = usesLayout && layout === "center";
  const isStacked = usesLayout && layout === "stacked";
  const canShrink = scroll === "shrink" && !isIsland && !isFab;
  // Phones: the bar docks at the bottom (dock always; FAB has no bar).
  const dockBottom = (position === "bottom" && !isFab) || isDock;
  // FAB opens its own popover, never the full-screen sheet.
  const isSheet = menu === "fullscreen" && !isFab;
  const islandOpen =
    isIsland && !islandDismissed && (islandHover || islandFocus || islandPinned);
  const activeHref = NAV_ITEMS.find(({ href }) =>
    isActiveRoute(currentPath, href),
  )?.href;
  useMarkerSlide(desktopListRef, activeHref, active);

  // Full-screen menu: lock page scroll while it's open. The cleanup runs as
  // soon as it starts closing, so the deferred anchor scroll isn't blocked.
  useEffect(() => {
    if (!showMenu || !isSheet) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [showMenu, isSheet]);

  // Island: Escape collapses it (focus goes to its Menu trigger, which stays
  // visible), and a pointerdown outside drops a pin.
  useEffect(() => {
    if (!islandOpen) return;
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      islandTriggerRef.current?.focus();
      setIslandPinned(false);
      setIslandDismissed(true);
    };
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setIslandPinned(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [islandOpen, navRef]);

  // Scroll "progress": a passive, rAF-throttled listener writes each line's
  // scaleX directly (no React state per frame). Some shapes have one line for
  // phones and another for desktop, so it updates every [data-nav-progress].
  useEffect(() => {
    if (scroll !== "progress") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const lines = navRef.current?.querySelectorAll("[data-nav-progress]") ?? [];
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      lines.forEach((line) => {
        line.style.transform = `scaleX(${progress})`;
      });
    };
    const onChange = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    onChange();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scroll, shape, showMenu, navRef]);

  // Position "bottom" is preview-only for now: pad the page so the footer
  // clears the docked bar (.nav-dock-bottom in globals.css).
  useEffect(() => {
    if (!preview || !dockBottom) return;
    const root = document.documentElement;
    root.classList.add("nav-dock-bottom");
    return () => root.classList.remove("nav-dock-bottom");
  }, [preview, dockBottom]);

  // Desktop-only shapes in preview: keep page content out from under the
  // rail (left) or the bottom pieces of dock and corners.
  useEffect(() => {
    const padding = isRail ? "nav-rail-left" : isDock || isCorners ? "nav-dock-desktop" : null;
    if (!preview || !padding) return;
    const root = document.documentElement;
    root.classList.add(padding);
    return () => root.classList.remove(padding);
  }, [preview, isRail, isDock, isCorners]);

  const hideNavbar = scroll === "hide" && isScrolledAway && !showMenu;

  // Leaving the nav also resets the island's keyboard state.
  const onNavBlur = (event) => {
    if (isIsland && !navRef.current?.contains(event.relatedTarget)) {
      setIslandFocus(false);
      setIslandDismissed(false);
    }
    onMenuBlur(event);
  };

  const onItemClick = (event, href) => {
    if (isAnchor(href) && showMenu) {
      // Defer the scroll until the menu has closed, so the full-screen
      // sheet's scroll lock is gone and focus can move to the target.
      event.preventDefault();
      deferAnchor(href);
    } else if (isAnchor(href)) {
      scrollToAnchor(event, href);
    } else if (preview) {
      event.preventDefault();
      setPreviewPath(href);
    }
    setShowMenu(false);
  };

  // ----- Variant classes ------------------------------------------------
  // The defaults (full, right, glass, hide, top) produce exactly the
  // shipping markup; every variant only adds or swaps classes.
  const activeColor = active === "pill" ? "text-on-accent" : "text-accent-strong";
  // Pill-type surface (bg-surface-raised + shadow) for detached bars; the
  // full bar, the rail and the phone bar of dock/corners are bar-type
  // (bg-page + hairline).
  const detached = !(isFull || desktopOnly);
  // Phones: an open menu turns island/split into the floating panel and the
  // notch into the hanging panel.
  const asPanel = showMenu && (isIsland || isSplit || isNotch);
  const isPanel = shape === "floating" || (asPanel && !isNotch);
  const asHanging = isHanging || (isNotch && asPanel);
  const baseHeight = isFull || isHanging || desktopOnly ? "h-16" : "h-14";
  const rowHeight = canShrink && isPastTop ? "h-12" : baseHeight;
  // Shrink and stacked size the row itself; the logo and links follow it
  // (with shrink, the links' wrappers fill the row too, so h-full resolves
  // to the row's height rather than the text's).
  const itemHeight = canShrink || isStacked ? "h-full" : rowHeight;
  const fillRow = canShrink ? " h-full" : "";
  const pillRadius = showMenu && !isSheet ? "rounded-lg" : "rounded-full";
  const radius =
    isStacked && !isPastTop && !showMenu ? "rounded-full md:rounded-lg" : pillRadius;
  // Attached to the top edge (bottom edge when docked on phones).
  const notchRadius = dockBottom
    ? "rounded-b-full max-md:rounded-b-none max-md:rounded-t-full"
    : "rounded-b-full";
  const hangingRadius = dockBottom
    ? "rounded-b-lg max-md:rounded-b-none max-md:rounded-t-lg"
    : "rounded-b-lg";
  const navRadius = isNotch && !asPanel ? notchRadius : asHanging ? hangingRadius : radius;

  // Surface. Every surface goes solid while the mobile menu is open, so page
  // content doesn't show through behind the large menu links.
  // backdrop-filter makes its element the containing block for fixed
  // children, so it's dropped while the full-screen sheet (position: fixed)
  // is open. The bar is solid then anyway.
  const blur = showMenu && isSheet ? "" : "backdrop-blur-md";
  // The rail's hairline runs down its right edge from md.
  const hairline = isRail
    ? dockBottom
      ? "border-line md:border-r-[0.5px] max-md:border-t-[0.5px]"
      : "border-line md:border-r-[0.5px] max-md:border-b-[0.5px]"
    : dockBottom
      ? "border-b-[0.5px] border-line max-md:border-b-0 max-md:border-t-[0.5px]"
      : "border-b-[0.5px] border-line";
  const glassClass = (pill) =>
    pill
      ? `${showMenu ? "bg-surface-raised" : "bg-surface-raised/85"} ${blur} shadow-2`
      : `${showMenu ? "bg-page" : "bg-page/85"} ${blur} ${hairline}`;
  const surfaceClass = (pill) => {
    if (surface === "glass") return glassClass(pill);
    if (surface === "clear") return ""; // the layer below carries it
    // Inverted: bg-page/text-fg resolve to the other theme (.nav-inverted).
    const bg = pill && surface === "solid" ? "bg-surface-raised" : "bg-page";
    return `${surface === "inverted" ? "nav-inverted " : ""}${bg} ${pill ? "shadow-2" : hairline}`;
  };
  // Dock and corners: the <nav> is only the phone bar; from md it's an empty
  // box and its pieces are fixed pills (so no background, blur or transform
  // on it there: any of those would make it their containing block).
  const phoneBarSurface = () => {
    const line = dockBottom ? "border-line max-md:border-t-[0.5px]" : "border-line max-md:border-b-[0.5px]";
    if (surface === "clear") return "";
    if (surface === "glass")
      return `${showMenu ? "max-md:bg-page" : "max-md:bg-page/85"} ${
        blur ? "max-md:backdrop-blur-md" : ""
      } ${line}`;
    return `${surface === "inverted" ? "nav-inverted " : ""}max-md:bg-page ${line}`;
  };
  // Clear: the glass background fades in behind the content past the top.
  const clearLayer = (pill, layerRadius, extra = "") =>
    surface === "clear" ? (
      <span
        aria-hidden="true"
        data-visible={isPastTop || showMenu ? "" : undefined}
        className={`nav-surface-layer pointer-events-none absolute inset-0 -z-10 ${
          pill ? layerRadius : ""
        } ${glassClass(pill)}${extra}`}
      />
    ) : null;
  // Progress: a 3px line along the surface's bottom edge (top edge while
  // docked at the bottom), scaled by the effect above.
  const progressLine = (pill, extra = "") =>
    scroll === "progress" ? (
      <span
        data-nav-progress=""
        aria-hidden="true"
        style={{ transform: "scaleX(0)" }}
        className={`pointer-events-none absolute ${pill ? "inset-x-6" : "inset-x-0"} ${
          dockBottom ? "bottom-0 max-md:bottom-auto max-md:top-0" : "bottom-0"
        } h-[3px] origin-left rounded-full bg-accent-strong${extra}`}
      />
    ) : null;

  // Geometry. Detached bars sit 12px in (16px on lg); docked at the bottom,
  // below md they anchor to the bottom edge above the safe area.
  const detachedAnchor = dockBottom
    ? "top-3 lg:top-4 max-md:top-auto max-md:bottom-[calc(0.75rem+env(safe-area-inset-bottom))]"
    : "top-3 lg:top-4";
  const fullGeometry = dockBottom
    ? "w-full top-0 max-md:top-auto max-md:bottom-0 max-md:pb-[env(safe-area-inset-bottom)]"
    : "w-full top-0";
  const attachAnchor = dockBottom
    ? "top-0 max-md:top-auto max-md:bottom-0 max-md:pb-[env(safe-area-inset-bottom)]"
    : "top-0";
  const geometry = isFull || isCorners || isDock
    ? fullGeometry
    : isRail
      ? `left-0 ${fullGeometry} md:bottom-0 md:w-[88px]`
      : asHanging
        ? // Inset + row padding (px-4, lg:px-6) adds up to the page gutter
          // (24px, lg 32px), so the logo and links line up with the content.
          `inset-x-2 ${attachAnchor} mx-auto max-w-[1104px] ${navRadius}`
        : isNotch
          ? `inset-x-0 ${attachAnchor} mx-auto w-fit max-w-[calc(100%-1.5rem)] ${navRadius}`
          : isPanel
            ? `inset-x-3 ${detachedAnchor} mx-auto max-w-[1088px] lg:inset-x-6 ${radius}`
            : isIsland
              ? `inset-x-0 ${detachedAnchor} mx-auto w-fit max-w-[calc(100%-1.5rem)] rounded-full`
              : `inset-x-0 ${isFab ? "top-3 lg:top-4" : detachedAnchor}`; // split, FAB: the pills carry the surface
  // Split and FAB: the nav is a transparent strip, the pills carry it all.
  const piecesOnly = (isSplit && !asPanel) || isFab;
  const navSurface = piecesOnly
    ? ""
    : isCorners || isDock
      ? phoneBarSurface()
      : surfaceClass(detached);
  // Docked at the bottom the menu opens upward, so it comes before the row.
  const dockClass = dockBottom ? "max-md:flex max-md:flex-col-reverse" : "";
  // Detached bars move further to hide (past their inset and shadow).
  // Desktop-only shapes only hide their phone bar this way; from md the
  // pieces of dock and corners hide themselves ([data-hidden]) and the rail
  // never hides.
  const hiddenClass = !hideNavbar
    ? ""
    : desktopOnly
      ? dockBottom
        ? "max-md:translate-y-full"
        : "max-md:-translate-y-full"
      : isFull
        ? dockBottom
          ? "max-md:translate-y-full md:-translate-y-full"
          : "hidden-nav"
        : dockBottom
          ? "max-md:translate-y-[calc(100%+2.5rem+env(safe-area-inset-bottom))] md:translate-y-[calc(-100%-2.5rem)]"
          : "translate-y-[calc(-100%-2.5rem)]";
  const sheetPad = `${
    isNotch ? "pt-14" : isHanging ? "pt-16" : detached ? "px-3 pt-[68px] lg:px-6" : "pt-16"
  }${
    dockBottom
      ? ` max-md:pt-6 ${
          detached && !isNotch && !isHanging
            ? "max-md:pb-[calc(4.25rem+env(safe-area-inset-bottom))]"
            : "max-md:pb-[calc(4rem+env(safe-area-inset-bottom))]"
        }`
      : ""
  }`;
  // Above the full-screen sheet, so the logo and close button stay visible
  // over it.
  const overSheet = isSheet ? " relative z-10" : "";

  const renderMenuLinks = ({ size, itemClass, rowClass, numbered }) =>
    NAV_ITEMS.map(({ label, href }, index) => {
      const isActive = isActiveRoute(currentPath, href);
      return (
        <li
          key={href}
          style={{ "--i": index }}
          className={`nav-menu-item ${itemClass}`}
        >
          <Link
            ref={index === 0 ? firstMenuLinkRef : undefined}
            href={href}
            aria-current={isActive ? "page" : undefined}
            onClick={(event) => onItemClick(event, href)}
            // Left-aligned with the logo: -mx-3/px-3 keeps the text on the
            // container edge and leaves room for the inset focus ring.
            className={`-mx-3 px-3 ${rowClass} ${
              numbered ? "justify-between" : ""
            } ${linkClass(isActive, size, activeColor)}`}
          >
            {/* Static marker on mobile: the menu is only open briefly, so
                nothing needs to slide. */}
            <LinkLabel
              label={label}
              isActive={isActive}
              variant={active}
              large
            />
            {numbered && (
              <span aria-hidden="true" className="type-small text-fg-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </Link>
        </li>
      );
    });

  const onLogoClick = (event) => {
    if (preview) {
      event.preventDefault();
      setPreviewPath("/");
      setShowMenu(false);
      return;
    }
    // Already home: a same-URL link does nothing, so go back to the top.
    if (currentPath !== "/") return;
    event.preventDefault();
    setShowMenu(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  const renderLogo = (height = itemHeight) => (
    <Link
      href="/"
      data-area={isStacked ? "logo" : undefined}
      aria-current={currentPath === "/" ? "page" : undefined}
      onClick={onLogoClick}
      className={`-mx-2 flex ${height} items-center gap-2 px-2 text-[18px] lg:gap-2.5 lg:text-[20px] ${focusRing} focus-visible:outline-offset-[-6px]`}
    >
      {/* Shrink scales an inner wrapper, so the hit area keeps its height. */}
      {canShrink ? (
        <span className="nav-shrink-logo flex items-center gap-2 lg:gap-2.5">
          <LogoContent />
        </span>
      ) : (
        <LogoContent />
      )}
    </Link>
  );
  const logo = renderLogo();

  const renderDesktopLink = ({ label, href }, height = itemHeight) => {
    const isActive = isActiveRoute(currentPath, href);
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        onClick={(event) => onItemClick(event, href)}
        className={`${height} px-3 ${linkClass(isActive, "type-small", activeColor)}`}
      >
        <LinkLabel
          label={label}
          isActive={isActive}
          variant={active}
          markerFor={isAnchor(href) ? undefined : href}
        />
      </Link>
    );
  };

  // The marker slide only measures inside this list (see useMarkerSlide),
  // so the fixed nav and scroll-to-top on navigation never add a vertical
  // jump.
  const linksList = (
    <ul
      ref={desktopListRef}
      data-area={isStacked ? "links" : undefined}
      className={`hidden md:flex flex-row items-center gap-1 md:gap-2${fillRow}${
        isCenter ? " md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2" : ""
      }`}
    >
      {NAV_ITEMS.map(({ label, href }) => {
        const isActive = isActiveRoute(currentPath, href);
        return (
          <li key={href} className={isStacked || canShrink ? "h-full" : undefined}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              onClick={(event) => onItemClick(event, href)}
              className={`${itemHeight} px-3 ${linkClass(isActive, "type-small", activeColor)}`}
            >
              <LinkLabel
                label={label}
                isActive={isActive}
                variant={active}
                markerFor={href}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const themeButton = (placement = "md:ml-2 md:-mr-[11px]", { vertical = false } = {}) =>
    theme === "swap" ? (
      <ThemeButton placement={placement} />
    ) : (
      <ThemeToggle
        variant={theme}
        isDark={isDark}
        setDark={setisDark}
        iconButtonClass={iconButtonClass}
        focusRing={focusRing}
        vertical={vertical}
        // The icon toggle's right-edge pull (-mr-*) fits a 22px glyph; the
        // wider variants have their own.
        className={
          THEME_TOGGLE_PULL[theme] === null
            ? placement
            : placement
                .replace(/(\S*:)?-mr-\S+/, (_, bp = "") =>
                  THEME_TOGGLE_PULL[theme] ? bp + THEME_TOGGLE_PULL[theme] : "",
                )
                .trim()
        }
      />
    );

  // A pill carrying its own surface. pillBase has no position, so the fixed
  // pieces of dock and corners can use it (relative would win over fixed).
  const pillBase = `isolate flex items-center rounded-full text-fg ${surfaceClass(true)}`;
  // FAB: the toggle is a 56px round pill at every width.
  const pillClass = `relative ${pillBase}`;
  const menuToggle = (
    <button
      ref={toggleRef}
      type="button"
      // The label variant's visible word is its accessible name.
      aria-label={icon === "label" ? undefined : "Menu"}
      aria-expanded={showMenu}
      aria-controls={MENU_ID}
      className={
        isFab
          ? `${pillClass} h-14 w-14 justify-center hover:text-fg-muted focus-visible:outline-offset-2`
          : icon === "label"
            ? `relative flex h-11 min-w-[44px] items-center justify-center px-3 -mr-3 hover:text-fg-muted ${focusRing} focus-visible:outline-offset-0 md:hidden`
            : `${iconButtonClass} md:hidden -mr-[11px]`
      }
      onClick={onToggleClick}
    >
      {isFab ? clearLayer(true, "rounded-full") : null}
      {icon === "classic" ? (
        <ClassicMenuIcon open={showMenu} />
      ) : icon === "label" ? (
        <MenuLabel open={showMenu} />
      ) : (
        <MenuIcon open={showMenu} />
      )}
    </button>
  );

  // Phone bar for the desktop-only shapes (the full bar's row without the
  // desktop links).
  const phoneRow = (
    <div
      data-compact={canShrink && isPastTop ? "" : undefined}
      className={`page-container flex ${rowHeight} flex-row items-center justify-between md:hidden${
        canShrink ? " nav-shrink-row" : ""
      }${overSheet}`}
    >
      {logo}
      <div className={`flex flex-row items-center gap-1${fillRow}`}>
        {themeButton("")}
        {menuToggle}
      </div>
    </div>
  );
  // Fixed pieces of dock and corners (md+). `hide` sets [data-hidden] on the
  // nav: corners fade their pieces, dock slides them off their edges.
  const piece = (place, hide, extra) =>
    `nav-piece ${hide} pointer-events-auto fixed ${place} ${pillBase} ${extra}`;
  const pieceLayer = clearLayer(true, "rounded-full");

  // Rail (md+): logo mark on top, links stacked in the middle, theme toggle
  // at the bottom. The marker is a bar on the links' screen-edge side.
  const railMarker = {
    underline: "pointer-events-none absolute left-0 top-1/2 -mt-[11px] h-[22px] w-[3px] rounded-full bg-current",
    dot: "pointer-events-none absolute left-2 top-1/2 -mt-[3px] h-1.5 w-1.5 rounded-full bg-current",
    pill: "pointer-events-none absolute inset-x-1 inset-y-1 rounded-full bg-accent",
  };
  const railDesktop = (
    <div className="hidden h-full flex-col items-center justify-between py-4 md:flex">
      <Link
        href="/"
        aria-current={currentPath === "/" ? "page" : undefined}
        onClick={onLogoClick}
        className={`flex h-11 w-11 items-center justify-center ${focusRing} focus-visible:outline-offset-0`}
      >
        <LogoMark className="h-8 w-8" />
        <span className="sr-only">Alfonso Lima</span>
      </Link>
      <ul ref={desktopListRef} className="flex w-full flex-col gap-1">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive = isActiveRoute(currentPath, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                onClick={(event) => onItemClick(event, href)}
                className={`relative min-h-[44px] w-full justify-center px-1 ${linkClass(isActive, "type-small", activeColor)}`}
              >
                {isAnchor(href) ? null : (
                  <span
                    aria-hidden="true"
                    data-marker={href}
                    className={`${railMarker[active]} origin-left ${isActive ? "" : "invisible"}`}
                  />
                )}
                <span className="relative">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {themeButton("", { vertical: true })}
    </div>
  );

  // Corners (md+): four fixed pills. Work and About share the bottom-left
  // pill (so the marker slides between them); Contact, an in-page action,
  // takes the bottom-right.
  const [contactItem] = NAV_ITEMS.filter(({ href }) => isAnchor(href));
  const routeItems = NAV_ITEMS.filter(({ href }) => !isAnchor(href));
  const cornersDesktop = (
    <div className="hidden md:block">
      <div className={piece("left-6 top-6", "nav-piece-fade", "h-14 px-4")}>
        {pieceLayer}
        {renderLogo("h-14")}
      </div>
      <div className={piece(
          "right-6 top-6",
          "nav-piece-fade",
          // Square for the icon toggles; the wider ones get a little padding.
          `h-14 justify-center ${THEME_TOGGLE_PULL[theme] === null ? "w-14" : "px-1.5"}`,
        )}>
        {pieceLayer}
        {themeButton("")}
      </div>
      <div className={piece("bottom-6 left-6", "nav-piece-fade", "h-14 px-1")}>
        {pieceLayer}
        <ul ref={desktopListRef} className="flex h-full flex-row items-center gap-1">
          {routeItems.map((item) => (
            <li key={item.href}>{renderDesktopLink(item, "h-14")}</li>
          ))}
        </ul>
      </div>
      {contactItem ? (
        <div className={piece("bottom-6 right-6", "nav-piece-fade", "h-14 px-1")}>
          {pieceLayer}
          {renderDesktopLink(contactItem, "h-14")}
        </div>
      ) : null}
      {scroll === "progress" ? (
        <span
          data-nav-progress=""
          aria-hidden="true"
          style={{ transform: "scaleX(0)" }}
          className="pointer-events-none fixed inset-x-0 top-0 h-[3px] origin-left rounded-full bg-accent-strong"
        />
      ) : null}
    </div>
  );

  // Dock (md+): logo pill top-left, links + theme in a pill at the bottom
  // centre. Each item scales on hover (.nav-dock-item).
  const dockDesktop = (
    <div className="hidden md:block">
      <div className={piece("left-6 top-4 lg:top-6", "nav-piece-up", "h-14 px-4")}>
        {pieceLayer}
        {renderLogo("h-14")}
      </div>
      <div
        className={piece(
          "inset-x-0 bottom-4 mx-auto w-fit lg:bottom-6",
          "nav-piece-down",
          "h-16 gap-1 px-3",
        )}
      >
        {pieceLayer}
        <ul ref={desktopListRef} className="flex h-full flex-row items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="nav-dock-item">
              {renderDesktopLink(item, "h-14")}
            </li>
          ))}
        </ul>
        <div className="nav-dock-item">{themeButton("")}</div>
        {progressLine(true, " md:bottom-0 md:top-auto")}
      </div>
    </div>
  );

  // FAB: popover anchored to the button (every width). It's the menu: same
  // id, same state and the same closing and focus rules as the phone menu.
  const fabPopover = (
    <div
      id={MENU_ID}
      data-open={showMenu ? "" : undefined}
      inert={!showMenu}
      className={`nav-popover absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-[28px] p-3 text-fg shadow-2 ${
        surface === "inverted" ? "nav-inverted bg-page" : "bg-surface-raised"
      }`}
    >
      <ul className="flex flex-col px-3">
        {renderMenuLinks({
          size: "type-h3",
          itemClass: "",
          rowClass: "min-h-[48px] py-2",
        })}
      </ul>
      <div
        style={{ "--i": NAV_ITEMS.length }}
        className="nav-menu-item mt-2 flex items-end justify-between gap-2 border-t-[0.5px] border-line px-3 pt-2"
      >
        <MenuSocials />
        {themeButton("shrink-0 -mr-2")}
      </div>
    </div>
  );

  // The bar's row. Each shape keeps one stable tree across its states, so
  // opening the menu never remounts (and unfocuses) the toggle.
  let row;
  if (isStacked) {
    row = (
      <div
        data-compact={isPastTop ? "" : undefined}
        style={{ "--nav-row": canShrink && isPastTop ? "3rem" : isFull ? "4rem" : "3.5rem" }}
        className={`page-container nav-stacked${overSheet}`}
      >
        {logo}
        {linksList}
        <div data-area="tools" className="flex flex-row items-center gap-1 md:gap-2">
          {themeButton()}
          {menuToggle}
        </div>
      </div>
    );
  } else if (isIsland) {
    row = (
      <div
        className={`flex ${rowHeight} flex-row items-center justify-between gap-1 ${
          asPanel ? "page-container" : "px-4 md:gap-2"
        }${overSheet}`}
      >
        {logo}
        <button
          ref={islandTriggerRef}
          type="button"
          aria-expanded={islandOpen}
          aria-controls={ISLAND_ID}
          onClick={() => {
            // Also undoes an Escape, so Enter/Space on the trigger reopens it.
            setIslandDismissed(false);
            setIslandPinned((pinned) => !pinned);
          }}
          className={`hidden md:inline-flex h-11 min-w-[44px] items-center justify-center px-3 type-small text-fg-muted hover:text-fg ${focusRing} focus-visible:outline-offset-0`}
        >
          Menu
        </button>
        <div
          id={ISLAND_ID}
          data-open={islandOpen ? "" : undefined}
          className="nav-island-expand hidden md:grid"
        >
          <div>
            <div className="flex items-center gap-1 px-1">
              {linksList}
              {themeButton("")}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-1 md:hidden">
          {themeButton("")}
          {menuToggle}
        </div>
      </div>
    );
  } else if (isSplit) {
    const pill = `pointer-events-auto relative isolate flex ${rowHeight} items-center rounded-full px-4 text-fg ${
      asPanel ? "" : surfaceClass(true)
    }`;
    row = (
      <div className={`page-container flex flex-row items-center justify-between gap-3${overSheet}`}>
        <div className={pill}>
          {asPanel ? null : clearLayer(true, "rounded-full")}
          {logo}
        </div>
        <div className={pill}>
          {asPanel ? null : clearLayer(true, "rounded-full")}
          <div className={`flex flex-row items-center gap-1 md:gap-2${fillRow}`}>
            {linksList}
            {themeButton()}
            {menuToggle}
          </div>
          {asPanel ? null : progressLine(true)}
        </div>
      </div>
    );
  } else if (isNotch || isHanging) {
    row = (
      <div
        data-compact={canShrink && isPastTop ? "" : undefined}
        className={`flex ${rowHeight} flex-row items-center justify-between ${
          isNotch && !asPanel ? "gap-6 px-8" : "px-4 lg:px-6"
        }${canShrink ? " nav-shrink-row" : ""}${overSheet}`}
      >
        {logo}
        <div className={`flex flex-row items-center gap-1 md:gap-2${fillRow}`}>
          {linksList}
          {themeButton()}
          {menuToggle}
        </div>
      </div>
    );
  } else if (isRail) {
    row = (
      <>
        {railDesktop}
        {phoneRow}
      </>
    );
  } else if (isCorners || isDock) {
    row = (
      <>
        {isCorners ? cornersDesktop : dockDesktop}
        {phoneRow}
      </>
    );
  } else if (isFab) {
    row = (
      <div className="page-container flex flex-row items-start justify-between gap-3">
        <div className={`pointer-events-auto ${pillClass} h-14 px-4`}>
          {clearLayer(true, "rounded-full")}
          {renderLogo("h-14")}
        </div>
        <div className="pointer-events-auto relative">
          {menuToggle}
          {fabPopover}
        </div>
      </div>
    );
  } else {
    row = (
      <div
        data-compact={canShrink && isPastTop ? "" : undefined}
        className={`page-container flex ${rowHeight} flex-row items-center justify-between${
          isCenter ? " relative" : ""
        }${canShrink ? " nav-shrink-row" : ""}${overSheet}`}
      >
        {logo}
        <div className={`flex flex-row items-center gap-1 md:gap-2${fillRow}`}>
          {linksList}
          {themeButton()}
          {menuToggle}
        </div>
      </div>
    );
  }
  const navLayers = !piecesOnly;
  // Layers that belong to the phone bar only (dock, corners: from md the
  // pieces carry their own; rail: the progress line is horizontal).
  const phoneOnlyLayer = isCorners || isDock ? " md:hidden" : "";
  // Split and FAB: the nav and row are transparent and full width, so they
  // let pointer events through to the page between the pills.
  const passThrough = piecesOnly;

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main"
        data-hidden={hideNavbar && (isCorners || isDock) ? "" : undefined}
        // Reveal the nav when keyboard focus moves into it while it's hidden.
        // Island: keyboard focus (not a click) inside opens it.
        onFocus={(event) => {
          revealNav();
          if (!isIsland) return;
          setIslandFocus(event.target.matches(":focus-visible"));
          setIslandDismissed(false);
        }}
        onBlur={onNavBlur}
        onMouseEnter={isIsland ? () => setIslandHover(true) : undefined}
        onMouseLeave={
          isIsland
            ? () => {
                setIslandHover(false);
                setIslandDismissed(false);
              }
            : undefined
        }
        className={`${geometry} ${navSurface} text-fg font-custom fixed z-40 transition-transform duration-[240ms] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none ${dockClass} ${hiddenClass}${
          passThrough ? " pointer-events-none" : ""
        }`}
      >
        {navLayers ? clearLayer(detached, navRadius, phoneOnlyLayer) : null}
        {row}

        {/* Always mounted, so it can animate closed: `inert` while closed
            (no focus, no clicks, hidden from assistive tech) and
            visibility: hidden once the close has played. FAB uses its
            popover instead. */}
        {isFab ? null : (
          <div id={MENU_ID} className="md:hidden">
            {isSheet ? (
              <div
                data-open={showMenu ? "" : undefined}
                inert={!showMenu}
                // Covers the viewport under the nav row; page scroll is
                // locked while it's open, so it scrolls itself if needed.
                // Floating, island and split: the sheet's content moves in by
                // the bar's side inset so the links line up with the logo.
                className={`nav-sheet fixed inset-0 flex flex-col overflow-y-auto bg-page ${sheetPad}`}
              >
                {/* Docked at the bottom, the links sit at the bottom too (in
                    thumb reach, just above the bar) with the socials under
                    them. */}
                <ul
                  className={`page-container flex flex-col gap-1 pt-6${
                    dockBottom ? " max-md:mt-auto" : ""
                  }`}
                >
                  {renderMenuLinks({
                    size: "type-display",
                    itemClass: "",
                    rowClass: "min-h-[56px] py-2",
                  })}
                </ul>
                <div
                  style={{ "--i": NAV_ITEMS.length }}
                  className={`nav-menu-item page-container mt-auto pb-8 pt-8${
                    dockBottom ? " max-md:mt-0" : ""
                  }`}
                >
                  <div className="border-t-[0.5px] border-line pt-2">
                    <MenuSocials />
                  </div>
                </div>
              </div>
            ) : (
              <div
                data-open={showMenu ? "" : undefined}
                inert={!showMenu}
                className="nav-dropdown"
              >
                <div>
                  {/* Mobile links use the h2 scale (not type-small like the
                    desktop row): on a phone the menu is the page's main
                    navigation, so it gets big, tappable, typographic links,
                    separated by hairlines. */}
                  {/* Hanging: the row's own padding, so the links line
                      up with the logo (the bar is inset from the page). */}
                  <ul className={`${asHanging ? "px-4" : "page-container"} flex flex-col pt-2 pb-2`}>
                    {renderMenuLinks({
                      size: "type-h2",
                      itemClass: "border-t-[0.5px] border-line first:border-t-0",
                      rowClass: "min-h-[56px] py-3",
                      numbered: menu === "numbered",
                    })}
                  </ul>

                  <div
                    style={{ "--i": NAV_ITEMS.length }}
                    className={`nav-menu-item ${asHanging ? "px-4" : "page-container"} pb-4`}
                  >
                    <div className="border-t-[0.5px] border-line pt-2">
                      <MenuSocials />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {navLayers ? progressLine(detached, isRail ? " md:hidden" : phoneOnlyLayer) : null}
      </nav>

      {/* Dims the page behind the open mobile menu. It sits outside <nav>, so
        a tap on it counts as "outside" and closes the menu; it also catches
        that tap, so nothing underneath gets activated by accident. The
        full-screen sheet covers the page itself, so it needs no scrim. */}
      {!isSheet && (
        <div
          aria-hidden="true"
          data-open={showMenu ? "" : undefined}
          className="nav-scrim fixed inset-0 z-30 bg-scrim/50 md:hidden"
        />
      )}
    </>
  );
}
