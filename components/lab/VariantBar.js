"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Floating variant switcher for the private lab pages: /lab
// (src/app/lab/LabClient.js), /lab/nav (src/app/lab/nav/NavLab.js) and
// /lab/cards (src/app/lab/cards/CardLab.js).
//
// /lab/nav and /lab/cards keep their state in the URL hash (e.g.
// #section=links&active=pill) so it survives a reload and can be shared.
// useHashParams() reads it; writeHash() replaces it without adding history
// entries. /lab keeps it in the query string instead (its sections render on
// the server), so it only uses the bar itself.
const HASH_EVENT = "lab-hashchange";

function subscribeToHash(callback) {
  window.addEventListener("hashchange", callback);
  window.addEventListener(HASH_EVENT, callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener(HASH_EVENT, callback);
  };
}

const getHash = () => window.location.hash.slice(1);
const getServerHash = () => "";

export function useHashParams() {
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  return new URLSearchParams(hash);
}

export function writeHash(state) {
  window.history.replaceState(null, "", `#${new URLSearchParams(state)}`);
  window.dispatchEvent(new Event(HASH_EVENT));
}

// Valid option id, or the fallback (so a stale or hand-edited hash can't
// select a variant that doesn't exist).
export function pick(options, value, fallback) {
  return options.some((o) => o.id === value) ? value : fallback;
}

function TabGroup({ label, name, ariaLabel, options, value, onSelect, panelId, dimmed, hint }) {
  const refs = useRef([]);

  const onKeyDown = (event, index) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    refs.current[next]?.focus();
    // The bar scrolls sideways on narrow screens; keep the new tab in view.
    refs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    onSelect(options[next].id);
  };

  return (
    <div className="flex items-center gap-1">
      <span className="hidden w-16 shrink-0 pl-3 text-[12px] text-fg-muted sm:inline lg:text-[13px]">
        {label}
      </span>
      <div
        role="tablist"
        aria-label={ariaLabel ?? label}
        title={dimmed ? hint : undefined}
        className={`flex gap-1 transition-opacity duration-200 ${dimmed ? "opacity-40" : ""}`}
      >
        {options.map((option, index) => {
          const isActive = option.id === value;
          // Options can carry a `group`; a hairline separates the groups.
          const newGroup = index > 0 && option.group && option.group !== options[index - 1].group;
          return (
            <React.Fragment key={option.id}>
            {newGroup ? (
              <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 self-center bg-line" />
            ) : null}
            <button
              ref={(el) => (refs.current[index] = el)}
              id={`tab-${name}-${option.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(option.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`inline-flex min-h-[44px] shrink-0 items-center rounded-full border px-4 type-small transition-[transform,color,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                isActive
                  ? "border-accent-strong bg-accent text-on-accent"
                  : "border-transparent text-fg hover:border-accent-strong hover:text-accent-strong"
              }`}
            >
              {option.label}
            </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * `section`: the top row ({ label, name, ariaLabel, options, value, onSelect }).
 * `rows`: the rows under it for the selected section, same shape plus
 * optional `ariaLabel`, `dimmed` and `hint`.
 * `panelId`: id of the role="tabpanel" element the tabs control.
 * `placement`: space-separated, default "bottom".
 * - "dock": the page's bar docks to the bottom of the screen below md (the
 *   nav lab's Position: Bottom). The switcher moves to the top of the screen
 *   below md: directly above the dock it would cover the menu that opens
 *   upward from it.
 * - "raised": something sits at the bottom centre from md (the nav lab's
 *   Dock shape), so the switcher lifts above it there.
 * `collapsible`: adds a Hide button beside the section row that shrinks the
 * bar to a "Show lab" pill (per visit, not part of the URL). Needs `section`.
 */
export default function VariantBar({
  section,
  rows,
  panelId,
  placement = "bottom",
  collapsible = false,
}) {
  const [collapsed, setCollapsed] = useState(false);
  // Hide and Show unmount each other, so focus moves to whichever replaced
  // the one just pressed (only after a toggle, never on first render).
  const toggledRef = useRef(false);
  const hideRef = useRef(null);
  const showRef = useRef(null);
  useEffect(() => {
    if (!toggledRef.current) return;
    toggledRef.current = false;
    (collapsed ? showRef : hideRef).current?.focus();
  }, [collapsed]);
  const toggle = (next) => {
    toggledRef.current = true;
    setCollapsed(next);
  };

  const tokens = placement.split(" ");
  const place = `bottom-4 ${tokens.includes("raised") ? "md:bottom-24 lg:bottom-28" : "lg:bottom-6"}${
    tokens.includes("dock")
      ? " max-md:bottom-auto max-md:top-[calc(1rem+env(safe-area-inset-top))]"
      : ""
  }`;
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 font-custom ${place}`}
    >
      {collapsed ? (
        <button
          ref={showRef}
          type="button"
          onClick={() => toggle(false)}
          aria-expanded={false}
          className="pointer-events-auto inline-flex min-h-[44px] items-center rounded-full bg-surface-raised px-5 type-small text-fg shadow-2 transition-[transform,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-accent-strong active:scale-[0.97]"
        >
          Show lab
        </button>
      ) : (
        <div className="pointer-events-auto flex max-w-full flex-col gap-1 overflow-x-auto rounded-[28px] bg-surface-raised p-1 shadow-2">
          {section && (
            <>
              {collapsible ? (
                <div className="flex items-center justify-between">
                  <TabGroup {...section} panelId={panelId} />
                  <button
                    ref={hideRef}
                    type="button"
                    onClick={() => toggle(true)}
                    aria-expanded={true}
                    className="inline-flex min-h-[44px] shrink-0 items-center rounded-full px-4 type-small text-fg-muted transition-colors duration-150 hover:text-fg"
                  >
                    Hide
                  </button>
                </div>
              ) : (
                <TabGroup {...section} panelId={panelId} />
              )}
              <div className="mx-3 border-t border-line" />
            </>
          )}
          {rows.map((row) => (
            <TabGroup key={row.name} {...row} panelId={panelId} />
          ))}
        </div>
      )}
    </div>
  );
}
