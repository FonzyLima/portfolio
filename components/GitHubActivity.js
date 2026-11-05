import React from "react";
import { TbArrowUpRight } from "react-icons/tb";
import HeatmapScroll from "./github/HeatmapScroll";

// GitHub activity as the last row of the Technical skills panel (passed as its
// `footer`, so it matches the category rows above it). Server component:
// `stats` comes from getGitHubStats() (src/app/lib/github.js), configured with
// the links in `github` in src/app/data/portfolioData.js. Renders nothing when
// the contribution graph couldn't be loaded.

const smallText = "text-[12px] text-fg-muted lg:text-[13px]";
const linkClass =
  "inline-flex min-h-[44px] items-center gap-1.5 type-small transition-colors duration-150 hover:text-accent-strong";
const fmt = new Intl.NumberFormat("en-US");

// Contribution level (0-4) -> cell fill. Tokens only, so the graph follows the
// theme and turns gold in Shiny Mode.
const levelClass = [
  "bg-placeholder",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

const formatDate = (date, options) =>
  new Date(`${date}T00:00:00Z`).toLocaleString("en-US", { ...options, timeZone: "UTC" });

// A label over each week where a new month starts. The first one is dropped
// when the next follows within three weeks, so they don't overlap.
function monthLabels(weeks) {
  const labels = [];
  let prev = null;
  weeks.forEach((week, index) => {
    const month = week[0].date.slice(0, 7);
    if (month !== prev) {
      labels.push({ index, text: formatDate(week[0].date, { month: "short" }) });
    }
    prev = month;
  });
  if (labels.length > 1 && labels[1].index - labels[0].index < 3) labels.shift();
  return labels;
}

function Legend() {
  return (
    <div className={`flex items-center gap-1.5 ${smallText}`} aria-hidden="true">
      <span className="mr-1">Less</span>
      {levelClass.map((c) => (
        <span key={c} className={`h-2.5 w-2.5 rounded ${c}`} />
      ))}
      <span className="ml-1">More</span>
    </div>
  );
}

function Heatmap({ weeks, total }) {
  return (
    <HeatmapScroll label="Contribution graph, past year">
      <div
        role="img"
        aria-label={`${fmt.format(total)} contributions in the past year`}
        className="grid min-w-[620px] gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, minmax(8px, 1fr))`,
          gridTemplateRows: "auto repeat(7, auto)",
        }}
      >
        {monthLabels(weeks).map(({ index, text }) => (
          <span
            key={`${index}-${text}`}
            className={`min-w-0 whitespace-nowrap pb-1 ${smallText}`}
            style={{ gridRow: 1, gridColumn: index + 1 }}
          >
            {text}
          </span>
        ))}
        {weeks.map((week, w) =>
          week.map((day) => (
            <span
              key={day.date}
              title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(
                day.date,
                { month: "short", day: "numeric", year: "numeric" }
              )}`}
              className={`aspect-square rounded ${levelClass[day.level] ?? levelClass[0]}`}
              style={{ gridRow: day.weekday + 2, gridColumn: w + 1 }}
            />
          ))
        )}
      </div>
    </HeatmapScroll>
  );
}

export default function GitHubActivity({ stats }) {
  if (!stats?.weeks?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-3 p-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 lg:p-6">
      <div className="flex flex-col">
        <h3 className="type-h3 text-fg">GitHub activity</h3>
        {stats.pastYear != null && (
          <p className="mt-1 type-small text-fg-muted">
            {fmt.format(stats.pastYear)} contributions in the past year
          </p>
        )}
        <a
          href={stats.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClass} self-start text-fg`}
        >
          @{stats.login}
          <TbArrowUpRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only"> on GitHub (opens in a new tab)</span>
        </a>
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <Heatmap weeks={stats.weeks} total={stats.pastYear ?? 0} />
        <div className="flex flex-wrap items-center justify-between gap-x-6">
          {stats.featured.length > 0 ? (
            <ul className="flex flex-wrap gap-x-5" aria-label="Featured repositories">
              {stats.featured.map((repo) => {
                const own = repo.fullName
                  .toLowerCase()
                  .startsWith(`${stats.login.toLowerCase()}/`);
                return (
                  <li key={repo.fullName}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={repo.description ?? undefined}
                      className={`${linkClass} text-fg-muted`}
                    >
                      {own ? repo.name : repo.fullName}
                      <TbArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <span />
          )}
          <Legend />
        </div>
      </div>
    </div>
  );
}
