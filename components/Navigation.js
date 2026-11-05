"use client";
import React from "react";
import Link from "next/link";
import { useRef } from "react";
import { MenuIcon } from "./nav/icons";
import {
  MENU_ID,
  NAV_ITEMS,
  focusRing,
  iconButtonClass,
  isActiveRoute,
  isAnchor,
  linkClass,
} from "./nav/config";
import { LinkLabel, LogoContent, MenuSocials } from "./nav/parts";
import { SegmentedThemeToggle } from "./nav/ThemeToggle";
import PaletteButton from "./palette/PaletteButton";
import { useMarkerSlide } from "./nav/useMarkerSlide";
import { useNavMenu } from "./nav/useNavMenu";
import { useNavScroll } from "./nav/useNavScroll";
import { scrollToAnchor } from "@/app/lib/scrollToAnchor";

// The site nav, rendered once from src/app/layout.js. Nav items are in
// ./nav/config.js. Only the shipping design lives here: a hanging glass bar
// (attached to the top edge, rounded below, inset from the page so its
// content lines up with the page's), links on the right, underline marker,
// segmented light/dark toggle, hides on scroll down, dropdown menu on
// phones. Its constants, pieces and hooks live in ./nav/.
//
// Mobile menu motion is CSS (.nav-dropdown, .nav-menu-item and .nav-scrim in
// src/app/globals.css): the dropdown's height opens ease-out and the links
// stagger in 30ms apart (--i is each item's index); on close the links fade
// first while the height starts slowly (ease-in-out). Reduced motion is an
// opacity-only fade with no height, slide or stagger. The menu stays mounted
// and is `inert` while closed.
export default function Navigation() {
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
  } = useNavMenu();
  const { isScrolledAway, revealNav } = useNavScroll();
  const desktopListRef = useRef(null);
  const activeHref = NAV_ITEMS.find(({ href }) => isActiveRoute(pathname, href))?.href;
  useMarkerSlide(desktopListRef, activeHref);

  const onItemClick = (event, href) => {
    if (isAnchor(href) && showMenu) {
      // Defer the scroll until the menu has closed, so focus can move to
      // the target.
      event.preventDefault();
      deferAnchor(href);
    } else if (isAnchor(href)) {
      scrollToAnchor(event, href);
    }
    setShowMenu(false);
  };

  const onLogoClick = (event) => {
    // Already home: a same-URL link does nothing, so go back to the top.
    if (pathname !== "/") return;
    event.preventDefault();
    setShowMenu(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const hideNavbar = isScrolledAway && !showMenu;
  // Glass. Solid while the mobile menu is open, so page content doesn't show
  // through behind the large menu links.
  const surface = `${showMenu ? "bg-surface-raised" : "bg-surface-raised/85"} backdrop-blur-md shadow-2`;

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main"
        // Reveal the nav when keyboard focus moves into it while it's hidden.
        onFocus={revealNav}
        onBlur={onMenuBlur}
        // Inset (8px) + the row's padding (px-4, lg:px-6) add up to the page
        // gutter (24px, lg 32px), so the logo and links line up with the
        // content below. Hiding slides it past its own shadow.
        className={`inset-x-2 top-0 mx-auto max-w-[1104px] rounded-b-lg ${surface} text-fg font-custom fixed z-40 transition-transform duration-[240ms] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none${
          hideNavbar ? " translate-y-[calc(-100%-2.5rem)]" : ""
        }`}
      >
        <div className="flex h-16 flex-row items-center justify-between px-4 lg:px-6">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={onLogoClick}
            className={`-mx-2 flex h-16 items-center gap-2 px-2 text-[18px] lg:gap-2.5 lg:text-[20px] ${focusRing} focus-visible:outline-offset-[-6px]`}
          >
            <LogoContent />
          </Link>
          <div className="flex flex-row items-center gap-1 md:gap-2">
            {/* The marker slide only measures inside this list, so the fixed
                nav and scroll-to-top on navigation never add a vertical
                jump. */}
            <ul
              ref={desktopListRef}
              className="hidden md:flex flex-row items-center gap-1 md:gap-2"
            >
              {NAV_ITEMS.map(({ label, href }) => {
                const isActive = isActiveRoute(pathname, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={(event) => onItemClick(event, href)}
                      className={`h-16 px-3 ${linkClass(isActive)}`}
                    >
                      <LinkLabel label={label} isActive={isActive} markerFor={href} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <PaletteButton className="md:ml-1" />
            <SegmentedThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              aria-label="Menu"
              aria-expanded={showMenu}
              aria-controls={MENU_ID}
              className={`${iconButtonClass} md:hidden -mr-[11px]`}
              onClick={onToggleClick}
            >
              <MenuIcon open={showMenu} />
            </button>
          </div>
        </div>

        {/* Always mounted, so it can animate closed: `inert` while closed
            (no focus, no clicks, hidden from assistive tech) and
            visibility: hidden once the close has played. */}
        <div id={MENU_ID} className="md:hidden">
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
              <ul className="flex flex-col px-4 pt-2 pb-2">
                {NAV_ITEMS.map(({ label, href }, index) => {
                  const isActive = isActiveRoute(pathname, href);
                  return (
                    <li
                      key={href}
                      style={{ "--i": index }}
                      className="nav-menu-item border-t-[0.5px] border-line first:border-t-0"
                    >
                      <Link
                        ref={index === 0 ? firstMenuLinkRef : undefined}
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={(event) => onItemClick(event, href)}
                        // Left-aligned with the logo: -mx-3/px-3 keeps the
                        // text on the container edge and leaves room for the
                        // inset focus ring.
                        className={`-mx-3 px-3 min-h-[56px] py-3 ${linkClass(isActive, "type-h2")}`}
                      >
                        {/* Static marker: the menu is only open briefly,
                            so nothing needs to slide. */}
                        <LinkLabel label={label} isActive={isActive} />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div
                style={{ "--i": NAV_ITEMS.length }}
                className="nav-menu-item px-4 pb-4"
              >
                <div className="border-t-[0.5px] border-line pt-2">
                  <MenuSocials />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Dims the page behind the open mobile menu. It sits outside <nav>, so
        a tap on it counts as "outside" and closes the menu; it also catches
        that tap, so nothing underneath gets activated by accident. */}
      <div
        aria-hidden="true"
        data-open={showMenu ? "" : undefined}
        className="nav-scrim fixed inset-0 z-30 bg-scrim/50 md:hidden"
      />
    </>
  );
}
