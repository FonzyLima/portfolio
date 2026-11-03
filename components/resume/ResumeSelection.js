"use client";

import React, { createContext, useContext, useState } from "react";

// Selection state for a resume layout whose markup is rendered on the server
// (the Career map in components/Resume.js). Only the selected index lives
// here; the rows and job details, icons included, arrive as server-rendered
// children/props, so no icon code ships to the browser.
const SelectionContext = createContext([0, () => {}]);

// Renders the layout's outer <div> (`className`) and provides the selection.
export function ResumeSelection({ initial = 0, className = "", children }) {
  const state = useState(initial);
  return (
    <SelectionContext.Provider value={state}>
      <div className={className}>{children}</div>
    </SelectionContext.Provider>
  );
}

// A toggle row: aria-pressed when its index is selected. `activeClassName` /
// `inactiveClassName` are added on top of `className` for each state.
export function SelectButton({
  index,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
  children,
}) {
  const [active, setActive] = useContext(SelectionContext);
  const selected = index === active;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => setActive(index)}
      className={`${className} ${selected ? activeClassName : inactiveClassName}`}
    >
      {children}
    </button>
  );
}

// Shows the panel for the selected index. `panels` are server-rendered nodes.
// With `sizeToLargest`, every panel is also laid out invisibly in the same grid
// cell, so the container is as tall as the tallest one and switching never
// shifts the page. The invisible copies are hidden from assistive tech and
// can't be focused; only the selected panel is real content.
export function SelectedPanel({ panels, sizeToLargest = false }) {
  const [active] = useContext(SelectionContext);
  if (!sizeToLargest) return panels[active] ?? null;
  return (
    <div className="grid">
      {panels.map((panel, index) => (
        <div
          key={index}
          aria-hidden="true"
          inert
          className="invisible col-start-1 row-start-1"
        >
          {panel}
        </div>
      ))}
      <div className="col-start-1 row-start-1">{panels[active]}</div>
    </div>
  );
}
