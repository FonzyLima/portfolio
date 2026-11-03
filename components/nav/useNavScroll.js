import { useEffect, useRef, useState } from "react";
import { ALWAYS_VISIBLE_ABOVE_Y, SCROLL_THRESHOLD } from "./config";

// Scroll state for the nav: `isScrolledAway` (scrolling down past
// ALWAYS_VISIBLE_ABOVE_Y, drives "hide") and `isPastTop` (past that line;
// only the lab's clear, shrink and stacked variants read it).
// `revealNav()` shows a hidden nav again (keyboard focus moved into it).
//
// One passive scroll listener for the component's lifetime, throttled to one
// update per animation frame. The direction only changes after more than
// SCROLL_THRESHOLD px of movement since the last change, so small jitters
// (trackpad momentum, iOS toolbar resize) don't toggle the nav.
export function useNavScroll() {
  const [isScrolledAway, setIsScrolledAway] = useState(false);
  const [isPastTop, setIsPastTop] = useState(false);
  const lastScrollY = useRef(0);
  // Last values handed to setIsScrolledAway / setIsPastTop, so the listener
  // only calls setState when one actually flips (not every frame).
  const scrolledAwayRef = useRef(false);
  const pastTopRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    lastScrollY.current = Math.max(window.scrollY, 0);

    const setAway = (away) => {
      if (scrolledAwayRef.current === away) return;
      scrolledAwayRef.current = away;
      setIsScrolledAway(away);
    };
    const update = () => {
      frame = 0;
      const y = Math.max(window.scrollY, 0);
      const pastTop = y > ALWAYS_VISIBLE_ABOVE_Y;
      if (pastTopRef.current !== pastTop) {
        pastTopRef.current = pastTop;
        setIsPastTop(pastTop);
      }
      if (!pastTop) {
        setAway(false);
        lastScrollY.current = y;
        return;
      }
      const delta = y - lastScrollY.current;
      if (Math.abs(delta) <= SCROLL_THRESHOLD) return;
      setAway(delta > 0);
      lastScrollY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Pick up a restored scroll position (reload, back/forward) once.
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const revealNav = () => {
    scrolledAwayRef.current = false;
    setIsScrolledAway(false);
  };

  return { isScrolledAway, isPastTop, revealNav };
}
