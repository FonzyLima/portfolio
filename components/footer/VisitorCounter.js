"use client";

import { useEffect, useState } from "react";

// "Trainers met: 1,204" in the footer's bottom bar. Counts once per browser
// session: the first page view POSTs /api/visits and keeps the answer in
// sessionStorage, later pages just read it back. Server-rendered with a
// placeholder so the row doesn't shift; hidden if the counter is unreachable.
export const VISIT_STORAGE_KEY = "visit";

const isVisit = (data) => !!data && typeof data.total === "number";

function readStored() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(VISIT_STORAGE_KEY));
    return isVisit(stored) ? stored : null;
  } catch {
    return null;
  }
}

/** This session's visit: from storage, else one POST. Null when unavailable. */
function loadVisit() {
  // One request per page even if the effect runs twice (Strict Mode).
  inflight ??= fetchVisit();
  return inflight;
}
let inflight;

async function fetchVisit() {
  const stored = readStored();
  if (stored) return stored;
  try {
    const res = await fetch("/api/visits", { method: "POST" });
    const data = res.ok ? await res.json() : null;
    if (!isVisit(data)) return null;
    try {
      sessionStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage blocked: the next page counts again, which is harmless.
    }
    return data;
  } catch {
    return null;
  }
}

export default function VisitorCounter() {
  const [visit, setVisit] = useState(undefined); // undefined loading, null failed

  useEffect(() => {
    let cancelled = false;
    loadVisit().then((data) => {
      if (!cancelled) setVisit(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (visit === null) return null;

  return (
    <p className="type-small text-fg-muted tabular-nums">
      Trainers met:{" "}
      <span className="inline-block min-w-[3ch] text-fg">
        {visit ? visit.total.toLocaleString("en-US") : "…"}
      </span>
    </p>
  );
}
