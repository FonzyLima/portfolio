import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { scrollToAnchor } from "@/app/lib/scrollToAnchor";

// The mobile menu's open state and its closing and focus rules, shared by the
// site nav and the lab's preview nav.
//
// Attach `navRef` to the <nav>, `toggleRef` to the menu button,
// `firstMenuLinkRef` to the menu's first link; call `onMenuBlur` from the
// nav's onBlur and `onToggleClick` from the button. For an anchor clicked
// in the open menu, call `deferAnchor(href)` (after preventDefault): it's
// scrolled to once the menu has closed.
//
// `closeOnDesktop`: close the menu when the viewport grows past md (the
// phone menu doesn't exist there; the lab's FAB popover does).
export function useNavMenu({ closeOnDesktop = true } = {}) {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const firstMenuLinkRef = useRef(null);
  const pendingAnchor = useRef(null);
  // Whether the menu was opened from the keyboard (only then is focus moved
  // into it), and whether the latest pointerdown landed inside the nav.
  const openedByKeyboard = useRef(false);
  const pointerInNav = useRef(false);

  // Close the menu on route change (including back/forward). This adjusts
  // state during render instead of in an effect.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setShowMenu(false);
  }

  // While the menu is open: focus the first link (keyboard opens only, so tap
  // users don't get a focus ring on "Work"), close on Escape (returning focus
  // to the toggle), on a pointerdown outside the nav, and if the viewport
  // grows past md. Focus leaving the nav is handled by onMenuBlur.
  useEffect(() => {
    if (!showMenu) return;
    if (openedByKeyboard.current) firstMenuLinkRef.current?.focus();

    const onKeyDown = (event) => {
      pointerInNav.current = false;
      if (event.key !== "Escape") return;
      setShowMenu(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (event) => {
      pointerInNav.current = Boolean(navRef.current?.contains(event.target));
      if (!pointerInNav.current) setShowMenu(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (event) => {
      if (event.matches && closeOnDesktop) setShowMenu(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [showMenu, closeOnDesktop]);

  // An anchor tapped in the open menu scrolls once the menu has closed. This
  // runs after any scroll lock (the lab's full-screen sheet) has been
  // released: React runs every effect cleanup before the next effects. No
  // target on this page: fall back to the native hash jump.
  useEffect(() => {
    if (showMenu) return;
    const href = pendingAnchor.current;
    if (!href) return;
    pendingAnchor.current = null;
    if (!scrollToAnchor(null, href)) window.location.hash = href;
  }, [showMenu]);

  // Close the menu when focus moves outside the nav (e.g. Tab past the last
  // link). Safari doesn't focus links or buttons on click, so a tap inside
  // the nav can blur to `null`; that, and the window itself losing focus,
  // don't count as leaving.
  const onMenuBlur = (event) => {
    if (!showMenu) return;
    const next = event.relatedTarget;
    if (next && navRef.current?.contains(next)) return;
    if (!next && (pointerInNav.current || !document.hasFocus())) return;
    setShowMenu(false);
  };

  const deferAnchor = (href) => {
    pendingAnchor.current = href;
  };

  const onToggleClick = (event) => {
    // detail is 0 for keyboard activation (Enter/Space), >= 1 for pointers.
    openedByKeyboard.current = event.detail === 0;
    if (!showMenu) pendingAnchor.current = null;
    setShowMenu((open) => !open);
  };

  return {
    pathname,
    showMenu,
    setShowMenu,
    navRef,
    toggleRef,
    firstMenuLinkRef,
    deferAnchor,
    onMenuBlur,
    onToggleClick,
  };
}
