// Server-only: GitHub activity for the About page. No token needed.
//
// Everything comes from public links (configured in `github` in
// src/app/data/portfolioData.js):
//   - The contribution graph and yearly total: the public HTML of
//     github.com/users/<login>/contributions, the same fragment GitHub's own
//     profile page loads.
//   - Repo links: GitHub's public REST API, without auth (60 requests/hour per
//     IP). Repos from the profile's own account cost one request in total;
//     each repo from another account costs one more. Refreshed hourly.
// Each part fails on its own: if one source is down or rate limited, that part
// is left out and the rest still renders.

const REVALIDATE = 3600;
const TIMEOUT_MS = 5000;
const HEADERS = { "User-Agent": "portfolio-site" };

// "https://github.com/FonzyLima" -> { owner: "FonzyLima" }
// "https://github.com/FonzyLima/mutya" -> { owner: "FonzyLima", name: "mutya" }
function parseLink(link) {
  try {
    const url = new URL(link.trim());
    if (!/(^|\.)github\.com$/i.test(url.hostname)) return null;
    const [owner, name] = url.pathname.split("/").filter(Boolean);
    return owner ? { owner, name: name?.replace(/\.git$/, "") } : null;
  } catch {
    return null;
  }
}

async function get(url, type) {
  const res = await fetch(url, {
    headers:
      type === "json" ? { ...HEADERS, Accept: "application/vnd.github+json" } : HEADERS,
    next: { revalidate: REVALIDATE },
    // A stalled github.com must not hold up a build or ISR regeneration.
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return type === "json" ? res.json() : res.text();
}

const toNumber = (text) => Number(text.replace(/,/g, ""));

// Parses the contributions fragment. Each day is a <td> with data-date,
// data-level (0-4) and an id ending in "-<weekday>-<week>"; its count is in the
// <tool-tip for="<id>"> ("3 contributions on ..." / "No contributions on ...").
function parseCalendar(html) {
  const total = html.match(/([\d,]+)\s+contributions?\s+in\s/);
  const tips = new Map();
  for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>\s*([^<]*)/g)) {
    const count = m[2].match(/^([\d,]+)\s+contribution/);
    tips.set(m[1], count ? toNumber(count[1]) : 0);
  }

  const weeks = [];
  for (const m of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
    const td = m[0];
    const date = td.match(/data-date="([^"]+)"/)?.[1];
    const id = td.match(/\bid="([^"]+)"/)?.[1];
    const pos = id?.match(/-(\d+)-(\d+)$/);
    if (!date || !pos) continue;
    (weeks[Number(pos[2])] ??= []).push({
      date,
      weekday: Number(pos[1]),
      count: tips.get(id) ?? 0,
      level: Number(td.match(/data-level="(\d)"/)?.[1] ?? 0),
    });
  }
  const filled = weeks.filter(Boolean).map((w) => w.sort((a, b) => a.weekday - b.weekday));
  if (!filled.length) throw new Error("no contribution days found");
  return {
    total: total ? toNumber(total[1]) : filled.flat().reduce((n, d) => n + d.count, 0),
    weeks: filled,
  };
}

const repoLink = (r) => ({
  name: r.name,
  fullName: r.full_name,
  url: r.html_url,
  description: r.description,
});

const settle = (promise) =>
  promise.catch((error) => {
    console.error("[github]", error.message);
    return null;
  });

export async function getGitHubStats({ profile, repos: repoLinks = [] } = {}) {
  const login = parseLink(profile ?? "")?.owner;
  if (!login) return null;
  const user = encodeURIComponent(login);
  const wanted = repoLinks.map(parseLink).filter((r) => r?.name);
  const isOwn = (r) => r.owner.toLowerCase() === login.toLowerCase();

  const [calendar, ownRepos] = await Promise.all([
    settle(get(`https://github.com/users/${user}/contributions`, "html").then(parseCalendar)),
    wanted.some(isOwn)
      ? settle(get(`https://api.github.com/users/${user}/repos?type=owner&per_page=100`, "json"))
      : null,
  ]);
  const ownByName = new Map((ownRepos ?? []).map((r) => [r.name.toLowerCase(), r]));

  const featured = (
    await Promise.all(
      wanted.map((r) => {
        const own = isOwn(r) && ownByName.get(r.name.toLowerCase());
        if (own) return repoLink(own);
        // If the API is down or rate limited (60/hour per IP, shared on hosts like
        // Vercel), keep the repo: its name and URL come from the pasted link, so
        // only the description is lost.
        return settle(
          get(`https://api.github.com/repos/${r.owner}/${r.name}`, "json").then(repoLink)
        ).then(
          (repo) =>
            repo ?? {
              name: r.name,
              fullName: `${r.owner}/${r.name}`,
              url: `https://github.com/${r.owner}/${r.name}`,
              description: null,
            }
        );
      })
    )
  ).filter(Boolean);

  return {
    login,
    url: `https://github.com/${login}`,
    pastYear: calendar?.total ?? null,
    weeks: calendar?.weeks ?? null,
    featured,
  };
}
