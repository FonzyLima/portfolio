// Server-only: the visitor counter behind /api/visits. No account or token.
//
// hits.sh keeps a counter per path and bumps it on every fetch of
// `https://hits.sh/<path>.svg`, answering with a badge whose <title> carries
// the numbers. The path is whatever link is pasted into `visitors.counter`
// in src/app/data/portfolioData.js. Outside production the path gets a
// "/dev" suffix so local runs don't inflate the real count.
import { visitors } from "@/app/data/portfolioData";

const TIMEOUT_MS = 5000;

export function counterUrl() {
  const link = visitors.counter?.trim();
  if (!link) return null;
  const url = new URL(link);
  if (process.env.NODE_ENV !== "production") {
    url.pathname = url.pathname.replace(/\.svg$/, "/dev.svg");
  }
  url.searchParams.set("view", "today-total");
  return url.toString();
}

/** Counts this visit and returns `{ today, total }`, or null when unconfigured. */
export async function recordVisit() {
  const url = counterUrl();
  if (!url) return null;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "portfolio-site" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const svg = await res.text();
  // <title>hits: 12 / 1,204</title> (today / total)
  const m = svg.match(/<title>hits:\s*([\d,]+)\s*\/\s*([\d,]+)<\/title>/);
  if (!m) throw new Error("hits.sh badge did not carry a count");
  const toNumber = (t) => Number(t.replace(/,/g, ""));
  return { today: toNumber(m[1]), total: toNumber(m[2]) };
}
