import React from "react";
import { TbCalendar, TbClock, TbMapPin } from "react-icons/tb";
import { experiences } from "@/app/data/portfolioData";
import { ResumeSelection, SelectButton, SelectedPanel } from "./resume/ResumeSelection";

// Server Component: the icons render to SVG on the server and no react-icons
// code ships. The Career map's selection state is a small client leaf in
// ./resume/.

/* ---------- helpers (all derived from portfolioData) ---------- */

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

const nowMonths = () => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
};

// "May 2026" -> months since year 0; "Present" -> this month.
function toMonths(text) {
  if (/present/i.test(text)) return nowMonths();
  const [month, year] = text.trim().split(/\s+/);
  return Number(year) * 12 + MONTHS.indexOf(month.toLowerCase());
}

const range = (e) => e.period.split(/\s+-\s+/).map(toMonths);

// "June 2024 - May 2026" -> "2 yrs"; counts both end months like LinkedIn.
function duration(e) {
  const [start, end] = range(e);
  const total = end - start + 1;
  if (!Number.isFinite(total) || total <= 0) return "";
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [
    years && `${years} yr${years > 1 ? "s" : ""}`,
    months && `${months} mo${months > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" ");
}

// "August 2023 - September 2024" -> "Aug 2023 – Sep 2024".
const period = (e) =>
  e.period
    .replace(/\b([A-Z][a-z]{2})[a-z]+(?=\s+\d{4})/g, "$1")
    .replace(/\s+-\s+/, " – ");

const isCurrent = (e) => /present/i.test(e.period);
const keyOf = (e) => `${e.company}-${e.period}`;

// Small meta details (dates, duration, location) laid out with spacing and
// icons instead of "·" separators.
function Meta({ items, className = "" }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 type-small text-fg-muted ${className}`}>
      {items
        .filter((item) => item.text)
        .map(({ icon: Icon, text }) => (
          <li key={text} className="inline-flex items-center gap-1.5">
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            {text}
          </li>
        ))}
    </ul>
  );
}

const metaFor = (e) => [
  { icon: TbCalendar, text: period(e) },
  { icon: TbClock, text: duration(e) },
  { icon: TbMapPin, text: e.location },
];

function CurrentPill() {
  return (
    <span className="rounded-full bg-accent px-3 py-1 text-[12px] text-on-accent lg:text-[13px]">
      Current
    </span>
  );
}

/* ---------- career map ---------- */

/* Career map: every job as a bar on a shared year axis, so tenure and
   overlaps are visible at a glance. Click a row to read it below. The rows
   are toggle buttons from ./resume/ResumeSelection; the selected bar's colour
   comes from the button's aria-pressed (group-aria-pressed). */
function CareerMap() {
  const firstYear = Math.min(...experiences.map((e) => Math.floor(range(e)[0] / 12)));
  const lastYear = Math.floor(nowMonths() / 12);
  const axisStart = firstYear * 12;
  const axisEnd = (lastYear + 1) * 12;
  const span = axisEnd - axisStart;
  const yearsOnAxis = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i);
  const pct = (m) => `${((m - axisStart) / span) * 100}%`;

  return (
    <ResumeSelection className="flex flex-col gap-6">
      <div className="flex flex-col">
        {/* Year axis, aligned with the bar column. */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
          <div className="hidden lg:block" />
          <div className="relative h-6" aria-hidden="true">
            {yearsOnAxis.map((y) => (
              <span
                key={y}
                className="absolute top-0 text-[12px] text-fg-muted lg:text-[13px]"
                style={{ left: pct(y * 12) }}
              >
                {y}
              </span>
            ))}
          </div>
        </div>

        {experiences.map((e, index) => {
          const [start, end] = range(e);
          return (
            <SelectButton
              key={keyOf(e)}
              index={index}
              className="group grid min-h-[44px] grid-cols-1 items-center gap-2 border-t border-line py-3 text-left transition-colors duration-150 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6"
              inactiveClassName="hover:text-accent-strong"
            >
              <span className="flex flex-col">
                <span className="type-small font-medium text-fg transition-colors duration-150 group-aria-pressed:text-accent-strong">
                  {e.role}
                </span>
                <span className="flex flex-wrap gap-x-3 text-[12px] text-fg-muted lg:text-[13px]">
                  <span>{e.company}</span>
                  <span>{duration(e)}</span>
                </span>
              </span>
              <span className="relative block h-3" aria-hidden="true">
                {yearsOnAxis.map((y) => (
                  <span
                    key={y}
                    className="absolute -top-3 bottom-[-12px] w-px bg-line"
                    style={{ left: pct(y * 12) }}
                  />
                ))}
                <span
                  className="absolute inset-y-0 rounded-full bg-fg/25 transition-colors duration-150 group-aria-pressed:bg-accent-strong"
                  style={{ left: pct(start), width: `calc(${pct(end + 1)} - ${pct(start)})`, minWidth: 8 }}
                />
              </span>
            </SelectButton>
          );
        })}
        <div className="border-t border-line" />
      </div>

      <div className="rounded-lg bg-surface p-5 shadow-1" aria-live="polite">
        <SelectedPanel
          panels={experiences.map((e) => (
            <MapDetail key={keyOf(e)} job={e} />
          ))}
        />
      </div>
    </ResumeSelection>
  );
}

// Compact job detail for the Career map, on the same two columns as the map:
// role, company and dates on the left, highlights on the right. The left
// column is the map's 260px minus the card's 20px padding, so the highlights
// start exactly under the bars. Bullets use type-small to keep the card short.
function MapDetail({ job }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="type-h3 text-fg">{job.role}</h3>
            {isCurrent(job) && <CurrentPill />}
          </div>
          <p className="type-small text-accent-strong">{job.company}</p>
        </div>
        <Meta items={metaFor(job)} className="lg:flex-col lg:items-start lg:gap-y-1" />
      </div>
      <ul className="flex flex-col gap-1.5 border-t border-line pt-3 lg:border-t-0 lg:pt-0.5">
        {job.highlights.map((h) => (
          <li key={h} className="flex max-w-[75ch] gap-3 type-small leading-[1.55] text-fg-muted">
            <span
              aria-hidden="true"
              className="mt-[0.7em] h-1 w-3 shrink-0 rounded-full bg-line-strong/40"
            />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Resume() {
  return (
    <section
      id="resume"
      className="page-container section-gap scroll-mt-24 font-custom"
    >
      <div className="flex flex-col gap-6 lg:gap-8">
        <h2 className="type-h2 text-fg">Experience</h2>
        <CareerMap />
      </div>
    </section>
  );
}
