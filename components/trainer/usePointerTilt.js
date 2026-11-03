"use client";

import { useEffect, useRef } from "react";

// Shared pointer tracking for the mouse tilts (trainer cards in ./TiltFlip and
// the project-card tilt in components/CardTilt). Mouse only, off with reduced
// motion. Per hover it checks the media query and measures the element once
// (on the first pointer event), then each pointermove only stores the position
// and at most one requestAnimationFrame per frame hands it to `apply`.
//
// The box is the element's untransformed size (offsetWidth/Height) centred on
// its measured centre, so a card that's already rotated doesn't skew the
// mapping and the tilt doesn't wobble at the edges. It's kept in page
// coordinates, so scrolling mid-hover doesn't throw it off.
//
//   start(el)          once per hover, after measuring (e.g. collect children)
//   apply(el, x, y)    x, y = pointer position over the card, 0..1
//   reset(el)          on leave
let reducedMotion = null;
const prefersReducedMotion = () =>
  (reducedMotion ??= window.matchMedia("(prefers-reduced-motion: reduce)")).matches;

export function usePointerTilt({ start, apply, reset }) {
  const ref = useRef(null);
  // box: undefined = not measured yet, false = tilt off this hover.
  const state = useRef({ box: undefined, frame: 0, x: 0.5, y: 0.5 });

  useEffect(() => {
    const s = state.current;
    return () => cancelAnimationFrame(s.frame);
  }, []);

  const measure = (event) => {
    const el = ref.current;
    if (event.pointerType !== "mouse" || !el || prefersReducedMotion()) return false;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return false;
    const r = el.getBoundingClientRect();
    start?.(el);
    return {
      left: r.left + r.width / 2 - w / 2 + window.scrollX,
      top: r.top + r.height / 2 - h / 2 + window.scrollY,
      w,
      h,
    };
  };

  const onPointerMove = (event) => {
    const s = state.current;
    if (s.box === undefined) s.box = measure(event);
    if (!s.box || event.pointerType !== "mouse") return;
    const clamp = (n) => Math.min(1, Math.max(0, n));
    s.x = clamp((event.pageX - s.box.left) / s.box.w);
    s.y = clamp((event.pageY - s.box.top) / s.box.h);
    if (s.frame) return;
    s.frame = requestAnimationFrame(() => {
      s.frame = 0;
      if (s.box && ref.current) apply(ref.current, s.x, s.y);
    });
  };

  const onPointerEnter = (event) => {
    state.current.box = undefined;
    onPointerMove(event);
  };

  const onPointerLeave = () => {
    const s = state.current;
    cancelAnimationFrame(s.frame);
    s.frame = 0;
    const wasActive = Boolean(s.box);
    s.box = undefined;
    if (wasActive && ref.current) reset(ref.current);
  };

  return { ref, onPointerEnter, onPointerMove, onPointerLeave };
}
