"use client";

import React from "react";
import { usePointerTilt } from "./trainer/usePointerTilt";

// Decorative pointer tilt for project cards (the "Tilt" hover variant, tried
// at /lab/cards). Mouse only, and off with reduced motion. It writes CSS vars
// on the element once per frame instead of re-rendering (measuring once per
// hover, see trainer/usePointerTilt), and a short ease-out transition smooths
// the movement so it doesn't track the cursor rigidly.
const MAX_DEG = 4;

const setTilt = (el, rx, ry) => {
  el.style.setProperty("--tilt-x", rx);
  el.style.setProperty("--tilt-y", ry);
};

export default function CardTilt({ className = "", children }) {
  const { ref, onPointerEnter, onPointerMove, onPointerLeave } = usePointerTilt({
    apply: (el, x, y) =>
      setTilt(el, `${((0.5 - y) * MAX_DEG * 2).toFixed(2)}deg`, `${((x - 0.5) * MAX_DEG * 2).toFixed(2)}deg`),
    reset: (el) => setTilt(el, "0deg", "0deg"),
  });

  return (
    <div
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`[transform:perspective(900px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] transition-transform duration-150 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
