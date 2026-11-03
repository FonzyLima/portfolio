import React from "react";
import { TbCalendar, TbChevronDown, TbClock, TbMapPin } from "react-icons/tb";
import { experiences } from "@/app/data/portfolioData";
import ResumeTabs from "./resume/ResumeTabs";
import { ResumeSelection, SelectButton, SelectedPanel } from "./resume/ResumeSelection";

// Server Component: the icons render to SVG on the server and no react-icons
// code ships. The Tabs and Career map selection state are small client leaves
// in ./resume/.

export const resumeVariants = [
  { id: "current", label: "Current" },
  { id: "logos", label: "Logo list" },
  { id: "featured", label: "Featured" },
  { id: "tabs", label: "Tabs" },
  { id: "map", label: "Career map" },
  { id: "index", label: "Index" },
];

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

// "2023 – 2024", or just "2023" when it starts and ends the same year.
const years = (e) => {
  const [a, b] = e.period.split(/\s+-\s+/);
  const ya = a.match(/\d{4}/)?.[0];
  const yb = /present/i.test(b) ? "Now" : b.match(/\d{4}/)?.[0];
  return ya === yb ? ya : `${ya} – ${yb}`;
};

// "Tenext AI" -> "TA", "The Mobile App Factory" -> "MA", "Serbiz" -> "S".
const initials = (name) =>
  name
    .split(/\s+/)
    .filter((w) => !/^the$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const isCurrent = (e) => /present/i.test(e.period);
const keyOf = (e) => `${e.company}-${e.period}`;

function Highlights({ items, className = "" }) {
  return (
    <ul className={`type-body max-w-[65ch] list-disc space-y-2 pl-5 text-fg-muted ${className}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Small meta details (dates, duration, location) laid out with spacing and
// optional icons instead of "·" separators.
function Meta({ items, className = "" }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 type-small text-fg-muted ${className}`}>
      {items
        .filter((item) => item.text)
        .map(({ icon: Icon, text, strong }) => (
          <li key={text} className={`inline-flex items-center gap-1.5 ${strong ? "text-fg" : ""}`}>
            {Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />}
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

// Highlights without bullet markers: each line separated by a hairline.
function PlainHighlights({ items }) {
  return (
    <ul className="flex flex-col divide-y divide-line border-t border-line">
      {items.map((item) => (
        <li key={item} className="py-3">
          <p className="type-body max-w-[65ch] text-fg-muted">{item}</p>
        </li>
      ))}
    </ul>
  );
}

function CurrentPill() {
  return (
    <span className="rounded-full bg-accent px-3 py-1 text-[12px] text-on-accent lg:text-[13px]">
      Current
    </span>
  );
}

// Role, company, dates and bullets for one job. Used by Tabs and Career map.
function JobDetail({ job }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="type-h3 text-fg">{job.role}</h3>
          <p className="type-body text-accent-strong">{job.company}</p>
        </div>
        {isCurrent(job) && <CurrentPill />}
      </div>
      <Meta items={metaFor(job)} />
      <PlainHighlights items={job.highlights} />
    </div>
  );
}

/* ---------- variants ---------- */

/* Current: what /about shows today, kept as the baseline. */
function CurrentResume() {
  return (
    <div className="flex flex-col gap-y-10 lg:gap-y-12">
      {experiences.map((e) => (
        <div
          key={keyOf(e)}
          className="grid grid-cols-1 gap-y-4 lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.6fr)] lg:gap-x-8 xl:grid-cols-[minmax(260px,1fr)_minmax(0,1.6fr)]"
        >
          <div className="flex flex-col gap-y-1.5">
            <h3 className="type-h3 text-fg">{e.company}</h3>
            <div className="type-small text-fg-muted">{e.period}</div>
            <div className="type-small text-fg-muted">{e.location}</div>
          </div>
          <div className="flex min-w-0 flex-col gap-y-2">
            <div className="type-body text-accent-strong">{e.role}</div>
            <Highlights items={e.highlights} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Logo list: a monogram tile per company, like a LinkedIn experience list.
   The tile echoes the Badge skill chips; the current job's tile is green. */
function LogosResume() {
  return (
    <ol className="flex flex-col">
      {experiences.map((e, index) => (
        <li
          key={keyOf(e)}
          className={`grid grid-cols-[48px_minmax(0,1fr)] gap-4 lg:grid-cols-[56px_minmax(0,1fr)] lg:gap-6 ${
            index === 0 ? "" : "mt-8 border-t border-line pt-8"
          }`}
        >
          <div
            aria-hidden="true"
            className={`flex h-12 w-12 items-center justify-center rounded-lg border text-[15px] font-semibold lg:h-14 lg:w-14 ${
              isCurrent(e)
                ? "border-accent bg-accent text-on-accent"
                : "border-line bg-surface-raised text-fg"
            }`}
          >
            {initials(e.company)}
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="type-h3 text-fg">{e.role}</h3>
                <span className="type-small text-fg-muted">{period(e)}</span>
              </div>
              <Meta
                items={[
                  { text: e.company, strong: true },
                  { icon: TbMapPin, text: e.location },
                  { icon: TbClock, text: duration(e) },
                ]}
              />
            </div>
            <Highlights items={e.highlights} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* Featured: the current role gets a large card; earlier roles collapse into
   a compact "Previously" list that opens on demand. */
function FeaturedResume() {
  const [now, ...past] = experiences;
  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      <article className="grid grid-cols-1 gap-6 rounded-lg bg-surface p-5 shadow-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-12 lg:p-8">
        <div className="flex flex-col items-start gap-4">
          {isCurrent(now) && <CurrentPill />}
          <div className="flex flex-col gap-1">
            <h3 className="type-h3 text-fg">{now.role}</h3>
            <p className="type-lead text-accent-strong">{now.company}</p>
          </div>
          <Meta items={metaFor(now)} />
        </div>
        <Highlights items={now.highlights} />
      </article>

      <div className="flex flex-col gap-4">
        <p className="type-small text-fg-muted">Previously</p>
        <div className="flex flex-col border-b border-line">
          {past.map((e) => (
            <details key={keyOf(e)} className="group border-t border-line">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <h4 className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="type-body font-medium text-fg">{e.role}</span>
                  <span className="type-small text-fg-muted">{e.company}</span>
                </h4>
                <span className="shrink-0 type-small text-fg-muted">{years(e)}</span>
                <TbChevronDown
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-fg-muted transition-transform duration-200 ease-out group-open:rotate-180"
                />
              </summary>
              <div className="flex flex-col gap-3 pb-6">
                <Meta items={metaFor(e)} />
                <Highlights items={e.highlights} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Tabs: pick a company on the left, read that job on the right. Uses the
   Portfolio filter-chip style; chips scroll sideways on phones. */
function TabsResume() {
  return (
    <ResumeTabs
      tabs={experiences.map((e) => ({ key: keyOf(e), company: e.company, years: years(e) }))}
      panels={experiences.map((e) => (
        <JobDetail key={keyOf(e)} job={e} />
      ))}
    />
  );
}

/* Career map: every job as a bar on a shared year axis, so tenure and
   overlaps are visible at a glance. Click a row to read it below. The rows
   are toggle buttons from ./resume/ResumeSelection; the selected bar's colour
   comes from the button's aria-pressed (group-aria-pressed). */
function MapResume() {
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
          sizeToLargest
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

/* Index: editorial list with the company names set large; role and years
   on the right, highlights in two newspaper columns (read down, then across). */
function IndexResume() {
  return (
    <div className="flex flex-col border-b border-line">
      {experiences.map((e) => (
        <article key={keyOf(e)} className="flex flex-col gap-5 border-t border-line py-8 lg:py-10">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:justify-between lg:gap-8">
            <h3 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.01em] text-fg lg:text-[32px]">
              {e.company}
            </h3>
            <p className="flex flex-wrap gap-x-4 type-small text-fg-muted lg:justify-end">
              <span className="text-accent-strong">{e.role}</span>
              <span>{years(e)}</span>
            </p>
          </div>
          <ul className="gap-x-12 lg:columns-2">
            {e.highlights.map((h) => (
              <li key={h} className="mb-3 flex break-inside-avoid gap-3 type-body text-fg-muted">
                <span aria-hidden="true" className="mt-[0.7em] h-1 w-3 shrink-0 rounded-full bg-line-strong/40" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

const resumes = {
  current: CurrentResume,
  logos: LogosResume,
  featured: FeaturedResume,
  tabs: TabsResume,
  map: MapResume,
  index: IndexResume,
};

export default function Resume({ variant = "current" }) {
  const Layout = resumes[variant] ?? CurrentResume;
  return (
    <section
      id="resume"
      className="page-container section-gap scroll-mt-24 font-custom"
    >
      <div className="flex flex-col gap-6 lg:gap-8">
        <h2 className="type-h2 text-fg">My Resume</h2>
        <Layout />
      </div>
    </section>
  );
}
