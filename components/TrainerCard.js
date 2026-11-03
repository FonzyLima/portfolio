import React from "react";
import Image from "next/image";
import {
  experiences,
  profile,
  projects as localProjects,
  socials,
} from "@/app/data/portfolioData";
import {
  TbCode,
  TbDeviceMobile,
  TbHeartbeat,
  TbLock,
  TbRocket,
  TbRotate,
  TbSettings,
  TbSparkles,
  TbStarFilled,
} from "react-icons/tb";
import { GLYPH_ROWS, textPath, textWidth } from "./gameboy/pixelFont";
import { technicalSkills } from "./skills/skillsData";
import BadgePickerClient from "./trainer/BadgePicker";
import { FlipButton, FlipFace, FlipInner, FlipRoot, Tilt } from "./trainer/TiltFlip";

/**
 * Pokémon-style trainer card for the About page. Everything on it is derived
 * from portfolioData: the trainer ID is hashed from the GitHub handle, the
 * Pokédex count is the number of projects (pass `projectCount` from the same
 * source the Portfolio page uses), time played runs from the first job to
 * today, and each company is a gym badge.
 *
 * Variants (see `trainerVariants`): classic, wide, badges, flip, screen, holo,
 * id, mini, tcg.
 *
 * Server Component: the icons and badges render to SVG on the server and no
 * react-icons code ships. The interactive bits are client leaves in
 * ./trainer/ (tilt, flip, badge picker) that receive server-rendered nodes.
 * The badge style is passed down as an `earned` prop.
 */

export const trainerVariants = [
  { id: "classic", label: "Classic" },
  { id: "wide", label: "Wide" },
  { id: "badges", label: "Badge case" },
  { id: "flip", label: "Flip" },
  { id: "screen", label: "Screen" },
  { id: "holo", label: "Holo" },
  { id: "id", label: "ID badge" },
  { id: "mini", label: "Mini" },
  { id: "tcg", label: "Trading card" },
];

// Badge looks: "earned" (icon per job, tenure pips, 8-slot case with locked
// slots) or the original "initials".
export const badgeStyles = [
  { id: "earned", label: "Earned" },
  { id: "initials", label: "Initials" },
];

/* ---------- derived data ---------- */

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const toMonths = (text) => {
  if (/present/i.test(text)) {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [month, year] = text.trim().split(/\s+/);
  return Number(year) * 12 + MONTHS.indexOf(month.toLowerCase());
};

// Computed at render time (not module load) so it never freezes; the About
// page revalidates hourly to keep the static HTML current too.
function getTimePlayed() {
  const now = new Date();
  const firstStart = Math.min(
    ...experiences.map((e) => toMonths(e.period.split(/\s+-\s+/)[0]))
  );
  const played = now.getFullYear() * 12 + now.getMonth() - firstStart;
  return `${Math.floor(played / 12)}y ${played % 12}m`;
}

const githubHandle =
  socials
    .find((s) => s.label === "GitHub")
    ?.href.replace(/\/$/, "")
    .split("/")
    .pop() ?? profile.name;
// Small stable hash -> 5-digit "IDNo." like the games.
const trainerId = String(
  [...githubHandle].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) %
    100000
).padStart(5, "0");

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
const years = (e) => {
  const [a, b] = e.period.split(/\s+-\s+/);
  const ya = a.match(/\d{4}/)?.[0];
  const yb = /present/i.test(b) ? "Now" : b.match(/\d{4}/)?.[0];
  return ya === yb ? ya : `${ya} – ${yb}`;
};
const currentIndex = Math.max(0, experiences.findIndex(isCurrent));

// `contributions` (GitHub, past 12 months) is optional: the row only shows when
// the page passes it (src/app/lib/github.js).
function getRows(projectCount, contributions) {
  return [
    { label: "Name", value: profile.name },
    { label: "Class", value: profile.title },
    { label: "Hometown", value: profile.location },
    { label: "Pokédex", value: `${projectCount} projects` },
    contributions != null && {
      label: "Contributions",
      value: `${contributions.toLocaleString("en-US")} past year`,
    },
    { label: "Time played", value: getTimePlayed() },
  ].filter(Boolean);
}

/* ---------- shared pieces ---------- */

// Header text in the Game Boy's pixel font (components/gameboy/pixelFont.js).
// The font has letters only, so keep pixel text to words.
function PixelText({ text, px = 2, className = "" }) {
  const w = textWidth(text, px);
  const h = GLYPH_ROWS * px;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={className}
    >
      <path d={textPath(text, 0, 0, px)} fill="currentColor" />
    </svg>
  );
}

// Gym badge outlines in a 40x40 box, one per company (cycles if there are more).
const BADGE_SHAPES = [
  "M20 3l17 10v14L20 37 3 27V13z", // hexagon
  "M20 2l18 18-18 18L2 20z", // diamond
  "M20 2c6 4 11 5 16 5v13c0 9-7 15-16 18C11 35 4 29 4 20V7c5 0 10-1 16-5z", // shield
  "M13 2h14l11 11v14L27 38H13L2 27V13z", // octagon
  "M20 2a18 18 0 110 36 18 18 0 010-36z", // circle
];

// `badge` values in portfolioData.experiences -> icon.
const BADGE_ICONS = {
  spark: TbSparkles,
  phone: TbDeviceMobile,
  rocket: TbRocket,
  heart: TbHeartbeat,
  gear: TbSettings,
};

// The games have eight gym badges; unearned slots show as locked.
const BADGE_SLOTS = Math.max(8, experiences.length);

// Months in a role, counting both end months.
const monthsIn = (e) => {
  const [start, end] = e.period.split(/\s+-\s+/).map(toMonths);
  return Math.max(1, end - start + 1);
};
// Tenure tier for the pips: under a year 1, one to two years 2, longer 3.
const tenureTier = (e) => (monthsIn(e) < 12 ? 1 : monthsIn(e) < 24 ? 2 : 3);
const tenureLabel = (e) => {
  const total = monthsIn(e);
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
};

// The original look: outline shape with the company's initials.
function InitialsBadge({ job, index, mono, className }) {
  const current = isCurrent(job) && !mono;
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <path
        d={BADGE_SHAPES[index % BADGE_SHAPES.length]}
        strokeWidth="2"
        className={
          current
            ? "fill-accent stroke-accent-strong"
            : mono
              ? "fill-transparent stroke-fg"
              : "fill-surface-raised stroke-line-strong"
        }
      />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="middle"
        className={`font-custom text-[12px] font-semibold ${current ? "fill-on-accent" : "fill-fg"}`}
      >
        {initials(job.company)}
      </text>
    </svg>
  );
}

// Earned look: the job's icon inside its shape, with tenure pips at the
// bottom (hidden at small sizes via `pips={false}`). Falls back to initials
// when a job has no `badge`.
function BadgeIcon({ job, index, earned, mono = false, className = "h-10 w-10", pips = true }) {
  const Icon = BADGE_ICONS[job.badge];
  if (!earned || !Icon) {
    return <InitialsBadge job={job} index={index} mono={mono} className={className} />;
  }
  const current = isCurrent(job) && !mono;
  const tier = tenureTier(job);
  return (
    <span className={`relative inline-flex shrink-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" focusable="false">
        <path
          d={BADGE_SHAPES[index % BADGE_SHAPES.length]}
          strokeWidth="2"
          className={
            current
              ? "fill-accent stroke-accent-strong"
              : mono
                ? "fill-transparent stroke-fg"
                : "fill-surface-raised stroke-line-strong"
          }
        />
      </svg>
      <Icon
        className={`absolute left-1/2 h-[42%] w-[42%] -translate-x-1/2 ${
          pips ? "top-[22%]" : "top-1/2 -translate-y-1/2"
        } ${current ? "text-on-accent" : "text-fg"}`}
      />
      {pips && (
        <span className="absolute bottom-[16%] left-1/2 flex -translate-x-1/2 gap-[2px]">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-1 w-1 rounded-full ${
                n <= tier
                  ? current
                    ? "bg-on-accent"
                    : "bg-fg"
                  : current
                    ? "bg-on-accent/30"
                    : "bg-fg/20"
              }`}
            />
          ))}
        </span>
      )}
    </span>
  );
}

// An unearned slot: dashed circle with a lock.
function LockedBadge({ className = "h-10 w-10" }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" focusable="false">
        <circle
          cx="20"
          cy="20"
          r="17"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="fill-transparent stroke-fg/25"
        />
      </svg>
      <TbLock className="absolute left-1/2 top-1/2 h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 text-fg/35" />
    </span>
  );
}

// How many locked slots to show (none in the initials look).
const lockedCount = (earned) => (earned ? BADGE_SLOTS - experiences.length : 0);

// Tappable badges plus a caption naming the selected one (client leaf in
// ./trainer/BadgePicker); the badges themselves are rendered here.
function BadgePicker({ earned, mono = false }) {
  return (
    <BadgePickerClient
      earned={earned}
      locked={lockedCount(earned)}
      initial={currentIndex}
      lockedBadge={<LockedBadge className="h-9 w-9" />}
      items={experiences.map((e, i) => ({
        key: keyOf(e),
        company: e.company,
        role: e.role,
        years: years(e),
        tenure: tenureLabel(e),
        badge: <BadgeIcon job={e} index={i} earned={earned} mono={mono} />,
      }))}
    />
  );
}

// Every badge with its label always visible, then the locked slots.
function BadgeList({ earned }) {
  const locked = lockedCount(earned);
  return (
    <ul className="flex flex-col divide-y divide-line">
      {experiences.map((e, i) => (
        <li key={keyOf(e)} className="flex items-center gap-3 py-2.5">
          <BadgeIcon job={e} index={i} earned={earned} />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="type-small font-medium text-fg">{e.company}</span>
            <span className="text-[12px] text-fg-muted lg:text-[13px]">{e.role}</span>
          </div>
          <span className="flex shrink-0 flex-col items-end text-[12px] text-fg-muted lg:text-[13px]">
            <span>{years(e)}</span>
            <span>{tenureLabel(e)}</span>
          </span>
        </li>
      ))}
      {locked > 0 && (
        <li className="flex items-center gap-3 py-2.5">
          <span className="flex gap-1">
            {Array.from({ length: locked }, (_, i) => (
              <LockedBadge key={i} className="h-7 w-7" />
            ))}
          </span>
          <span className="text-[12px] text-fg-muted lg:text-[13px]">{locked} more to earn</span>
        </li>
      )}
    </ul>
  );
}

// A static row of small badges (plus locked slots), for tight spaces.
function MiniBadgeRow({ earned, size, className = "", pips = true, labelled = false }) {
  const locked = lockedCount(earned);
  return (
    <ul
      className={`flex flex-wrap ${className}`}
      aria-label={labelled ? "Gym badges" : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {experiences.map((e, i) => (
        <li key={keyOf(e)} title={`${e.company}, ${e.role}`}>
          <BadgeIcon job={e} index={i} earned={earned} className={size} pips={pips} />
          {labelled && <span className="sr-only">{`${e.company}, ${e.role}, ${years(e)}`}</span>}
        </li>
      ))}
      {Array.from({ length: locked }, (_, i) => (
        <li key={`locked-${i}`} aria-hidden="true">
          <LockedBadge className={size} />
        </li>
      ))}
    </ul>
  );
}

function Header({ title = "TRAINER CARD" }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-accent px-5 py-3 text-on-accent">
      <h2 className="flex items-center">
        <PixelText text={title} />
        <span className="sr-only">{title.toLowerCase()}</span>
      </h2>
      <span className="text-[12px] lg:text-[13px]">
        <span className="sr-only">Trainer </span>IDNo. {trainerId}
      </span>
    </div>
  );
}

function Photo({ className = "h-24 w-24", sizes = "96px" }) {
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg border border-line bg-placeholder ${className}`}>
      <Image
        src="/about-profile.jpg"
        alt={profile.name}
        fill
        sizes={sizes}
        className="object-cover object-[center_20%]"
        preload
      />
    </div>
  );
}

function Rows({ rows, className = "flex flex-col gap-3" }) {
  return (
    <dl className={className}>
      {rows.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <dt className="text-[12px] text-fg-muted lg:text-[13px]">{label}</dt>
          <dd className="type-small text-fg">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function BadgesHeading({ earned }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-fg-muted lg:text-[13px]">Badges</span>
      <span className="type-small text-fg">
        {earned ? `${experiences.length}/${BADGE_SLOTS}` : experiences.length}
      </span>
    </div>
  );
}

const shell = "w-full overflow-hidden rounded-lg bg-surface shadow-1";

/* ---------- variants ---------- */

/* Classic: the original card, with tappable badges and a caption. */
function ClassicCard({ rows, earned }) {
  return (
    <aside aria-label="Trainer card" className={`max-w-[400px] ${shell}`}>
      <Header />
      <div className="flex flex-col gap-5 p-5 lg:p-6">
        <div className="flex items-start justify-between gap-5">
          <Rows rows={rows} className="flex min-w-0 flex-1 flex-col gap-3" />
          <Photo />
        </div>
        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <BadgesHeading earned={earned} />
          <BadgePicker earned={earned} />
        </div>
      </div>
    </aside>
  );
}

/* Wide: a landscape card that runs the full content width under the text. */
function WideCard({ rows, earned }) {
  return (
    <aside aria-label="Trainer card" className={shell}>
      <Header />
      <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-[120px_minmax(0,1fr)] lg:grid-cols-[140px_minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-8 lg:p-6">
        <Photo className="aspect-square w-[120px] lg:w-[140px]" sizes="140px" />
        <Rows rows={rows} className="grid grid-cols-2 content-start gap-x-6 gap-y-4" />
        <div className="flex flex-col gap-3 border-t border-line pt-4 md:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <BadgesHeading earned={earned} />
          <BadgePicker earned={earned} />
        </div>
      </div>
    </aside>
  );
}

/* Badge case: the badges are the point; every one is labelled. */
function BadgeCaseCard({ rows, earned }) {
  const [name, cls, ...stats] = rows;
  return (
    <aside aria-label="Trainer card" className={`max-w-[400px] ${shell}`}>
      <Header />
      <div className="flex flex-col gap-5 p-5 lg:p-6">
        <div className="flex items-center gap-4">
          <Photo className="h-16 w-16" sizes="64px" />
          <div className="flex min-w-0 flex-col">
            <span className="type-h3 text-fg">{name.value}</span>
            <span className="type-small text-fg-muted">{cls.value}</span>
          </div>
        </div>
        <Rows rows={stats} className="grid grid-cols-3 gap-3 border-y border-line py-4" />
        <div className="flex flex-col gap-1">
          <BadgesHeading earned={earned} />
          <BadgeList earned={earned} />
        </div>
      </div>
    </aside>
  );
}

/* Flip: trainer details on the front, labelled badges on the back. */
function FlipCard({ rows, earned }) {
  const flipButton = (label) => (
    <FlipButton
      label={label}
      className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-line px-4 type-small text-fg transition-[transform,border-color,color] duration-150 ease-out hover:border-accent-strong hover:text-accent-strong active:scale-[0.97]"
    />
  );
  const face = "absolute inset-0 flex flex-col [backface-visibility:hidden]";

  return (
    <FlipRoot as="aside" aria-label="Trainer card" className="w-full max-w-[400px] [perspective:1400px]">
      <FlipInner
        className="relative h-[480px] transition-transform duration-[450ms] ease-out will-change-transform [transform-style:preserve-3d] motion-reduce:transition-none"
        flippedClassName="[transform:rotateY(180deg)]"
      >
        <FlipFace side="front" className={`${face} ${shell}`}>
          <Header />
          <div className="flex flex-1 flex-col gap-5 p-5 lg:p-6">
            <div className="flex items-start justify-between gap-5">
              <Rows rows={rows} className="flex min-w-0 flex-1 flex-col gap-3" />
              <Photo />
            </div>
            <div className="mt-auto flex flex-col gap-3 border-t border-line pt-4">
              <BadgesHeading earned={earned} />
              <div className="flex items-center justify-between gap-3">
                <MiniBadgeRow earned={earned} size="h-8 w-8" className="gap-1.5" />
                {flipButton("See badges")}
              </div>
            </div>
          </div>
        </FlipFace>

        <FlipFace side="back" className={`${face} ${shell} [transform:rotateY(180deg)]`}>
          <Header title="BADGES" />
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5 lg:p-6">
            <BadgeList earned={earned} />
            <div className="mt-auto flex justify-end border-t border-line pt-4">
              {flipButton("Back to card")}
            </div>
          </div>
        </FlipFace>
      </FlipInner>
    </FlipRoot>
  );
}

/* Screen: the card drawn as a handheld's LCD screen with a pixel-font title
   and a pixelated portrait. Ties into the homepage Game Boy. */
function ScreenCard({ rows, earned }) {
  return (
    <aside
      aria-label="Trainer card"
      className="w-full max-w-[400px] rounded-[12px] rounded-br-[44px] border border-line bg-surface-raised p-4 pb-6 shadow-1 lg:p-5 lg:pb-8"
    >
      <div className="flex items-center gap-2 pb-3 text-fg-muted">
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_6px_rgb(var(--accent))]" aria-hidden="true" />
        <PixelText text="POWER" px={1} />
      </div>
      <div className="relative overflow-hidden rounded-[4px] border-2 border-fg/70 bg-accent/15 p-4 text-fg">
        {/* Faint LCD pixel grid. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:4px_4px]"
        />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center">
              <PixelText text="TRAINER CARD" />
              <span className="sr-only">Trainer card</span>
            </h2>
            <span className="text-[12px] lg:text-[13px]">
              <span className="sr-only">Trainer </span>IDNo. {trainerId}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dl className="flex min-w-0 flex-1 flex-col gap-2.5">
              {rows.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="text-[12px] text-fg-muted lg:text-[13px]">{label}</dt>
                  <dd className="type-small">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="relative h-24 w-24 shrink-0 overflow-hidden border-2 border-fg/70 bg-placeholder">
              <Image
                src="/about-profile.jpg"
                alt={profile.name}
                fill
                sizes="32px"
                className="object-cover object-[center_20%] grayscale contrast-125 [image-rendering:pixelated]"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-accent/30 mix-blend-multiply" />
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t-2 border-dashed border-fg/30 pt-3">
            <span className="text-[12px] text-fg-muted lg:text-[13px]">Badges</span>
            <BadgePicker earned={earned} mono />
          </div>
        </div>
      </div>
    </aside>
  );
}

// Mouse-driven tilt (--rx/--ry on the card; --mx/--my, --sheen on the
// `data-tilt-sheen` glare): the Tilt client leaf in ./trainer/TiltFlip. Mouse
// only; skipped for touch and reduced motion.

/* Holo: Classic with a foil edge that tilts toward the mouse and a green
   sheen that follows it. Mouse only; skipped for touch and reduced motion.
   Plain CSS variables, no animation library. */
function HoloCard({ rows, earned }) {
  return (
    <div className="w-full max-w-[400px] [perspective:1000px]">
      <Tilt
        as="aside"
        aria-label="Trainer card"
        className={`relative ring-1 ring-accent/40 transition-transform duration-300 ease-out [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] ${shell}`}
      >
        <Header />
        <div className="flex flex-col gap-5 p-5 lg:p-6">
          <div className="flex items-start justify-between gap-5">
            <Rows rows={rows} className="flex min-w-0 flex-1 flex-col gap-3" />
            <Photo />
          </div>
          <div className="flex flex-col gap-3 border-t border-line pt-4">
            <BadgesHeading earned={earned} />
            <BadgePicker earned={earned} />
          </div>
        </div>
        <div
          aria-hidden="true"
          data-tilt-sheen
          className="pointer-events-none absolute inset-0 opacity-[var(--sheen,0)] transition-opacity duration-300 [background:radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgb(var(--accent)/0.18),transparent_55%)]"
        />
      </Tilt>
    </div>
  );
}

// Decorative barcode drawn from the GitHub handle and trainer ID.
function Barcode({ className = "" }) {
  const seed = `${githubHandle}${trainerId}`;
  let x = 0;
  const bars = [...seed].flatMap((ch) => {
    const code = ch.charCodeAt(0);
    return [1 + (code % 3), 1 + ((code >> 2) % 2)].map((w, i) => {
      const bar = i === 0 ? { x, w } : null;
      x += w + 1;
      return bar;
    });
  }).filter(Boolean);
  return (
    <svg viewBox={`0 0 ${x} 24`} preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="24" className="fill-fg" />
      ))}
    </svg>
  );
}

/* ID badge: a portrait lanyard badge with a big photo and a barcode. */
function IdBadgeCard({ rows, earned }) {
  const [name, cls, ...stats] = rows;
  return (
    <aside aria-label="Trainer card" className={`mx-auto max-w-[320px] lg:mx-0 lg:justify-self-center ${shell}`}>
      <div className="flex justify-center bg-accent pb-2 pt-3">
        <span className="h-2 w-14 rounded-full bg-on-accent/30" aria-hidden="true" />
      </div>
      <Header />
      <div className="flex flex-col items-center gap-4 p-5 text-center lg:p-6">
        <Photo className="aspect-[4/5] w-40" sizes="160px" />
        <div className="flex flex-col gap-0.5">
          <span className="type-h3 text-fg">{name.value}</span>
          <span className="type-small text-fg-muted">{cls.value}</span>
        </div>
        <Rows rows={stats} className="grid w-full grid-cols-3 gap-2 border-y border-line py-3" />
        <BadgePicker earned={earned} />
        <div className="flex w-full flex-col items-center gap-1 pt-1">
          <Barcode className="h-8 w-full" />
          <span className="text-[12px] text-fg-muted lg:text-[13px]">
            <span className="sr-only">Trainer </span>IDNo. {trainerId}
          </span>
        </div>
      </div>
    </aside>
  );
}

/* Mini: a compact horizontal card for text-heavy layouts. */
function MiniCard({ rows, earned }) {
  const [name, cls, ...stats] = rows;
  return (
    <aside aria-label="Trainer card" className={`max-w-[400px] ${shell}`}>
      <div className="flex items-center gap-4 p-4">
        <Photo className="h-14 w-14 rounded-full" sizes="56px" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-2 text-accent-strong">
            <PixelText text="TRAINER" px={1} />
            <span className="text-[12px] text-fg-muted lg:text-[13px]">IDNo. {trainerId}</span>
          </span>
          <span className="type-small font-medium text-fg">{name.value}</span>
          <span className="truncate text-[12px] text-fg-muted lg:text-[13px]">{cls.value}</span>
        </div>
      </div>
      <Rows rows={stats} className="grid grid-cols-3 gap-2 border-t border-line px-4 py-3" />
      <div className="border-t border-line px-4 py-3">
        <BadgePicker earned={earned} />
      </div>
    </aside>
  );
}

/* Trading card: a collectible-card take, at real card proportions (63x88).
   Front: LV, name, HP and type; an art window that takes whatever height is
   left (so nothing is ever pushed off the card); two "attacks" built from the
   skill groups; a stat bar; flavour text and a card number. Back: monogram and
   the labelled badge list. Tilts with a foil glare on mouse hover and flips.
   Everything is derived from data: HP = projects x 10, LV = years of
   experience, attack damage = tools x 10. */
function TradingCard({ rows, projectCount, earned }) {
  const row = (label) => rows.find((r) => r.label === label);
  const [name, cls, hometown, played] = ["Name", "Class", "Hometown", "Time played"].map(row);
  const level = parseInt(played.value, 10) || 1;
  const attacks = technicalSkills.slice(0, 2);
  const year = new Date().getFullYear();
  const stats = [
    { label: "Projects", value: projectCount },
    { label: "Time played", value: played.value },
    { label: "Badges", value: experiences.length },
  ];

  const face =
    "absolute inset-0 rounded-[18px] bg-accent p-2.5 shadow-2 [backface-visibility:hidden]";
  const panel = "flex h-full flex-col overflow-hidden rounded-[10px] bg-surface-raised text-fg";

  return (
    <FlipRoot className="flex w-full max-w-[360px] flex-col items-center gap-3 lg:justify-self-center">
      <div className="w-full [perspective:1200px]">
        <Tilt
          maxDeg={14}
          className="transition-transform duration-200 ease-out will-change-transform [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
        >
          <FlipInner
            className="relative aspect-[63/88] w-full transition-transform duration-[450ms] ease-out will-change-transform [transform-style:preserve-3d] motion-reduce:transition-none"
            flippedClassName="[transform:rotateY(180deg)]"
          >
            {/* Front */}
            <FlipFace as="article" side="front" aria-label="Trainer card" className={face}>
              <div className={`${panel} gap-2 p-3`}>
                {/* Header: level, name, HP, type */}
                <header className="flex items-center gap-2">
                  <span className="shrink-0 rounded-full bg-fg px-2 text-[12px] font-semibold leading-[1.6] text-surface-raised">
                    LV.{level}
                  </span>
                  <h2 className="min-w-0 flex-1 truncate text-[19px] font-semibold leading-[1.2]">
                    {name.value}
                  </h2>
                  <span className="flex shrink-0 items-baseline gap-0.5">
                    <span className="text-[12px] font-semibold">HP</span>
                    <span className="text-[22px] font-semibold leading-none">{projectCount * 10}</span>
                  </span>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent"
                    aria-hidden="true"
                  >
                    <TbCode className="h-4 w-4" />
                  </span>
                </header>

                {/* Art: fills the leftover height; framed like a card window. */}
                <div className="relative min-h-[140px] flex-1 overflow-hidden rounded-[6px] border-[3px] border-accent bg-placeholder shadow-[inset_0_0_0_1px_rgb(0_0_0/0.2)]">
                  <Image
                    src="/about-profile.jpg"
                    alt={profile.name}
                    fill
                    // Top of /about, likely the LCP image: load it eagerly.
                    preload
                    sizes="(min-width: 400px) 330px, 85vw"
                    className="object-cover object-[52%_40%] sm:object-[52%_48%]"
                  />
                  {/* Glare: a fixed gradient twice the window's size, moved with
                      transform so following the mouse never repaints the face
                      (white over the photo needs no blend mode). */}
                  <div
                    aria-hidden="true"
                    data-tilt-sheen
                    className="pointer-events-none absolute -inset-1/2 opacity-[var(--sheen,0)] transition-opacity duration-300 will-change-transform [background:radial-gradient(circle,rgb(255_255_255/0.45),transparent_30%)] [transform:translate(calc((var(--mx,50%)_-_50%)_/_2),calc((var(--my,50%)_-_50%)_/_2))]"
                  />
                </div>

                {/* Caption strip under the art */}
                <p className="flex items-center justify-between gap-3 rounded-[4px] bg-accent/20 px-2 py-0.5 text-[12px] leading-[1.5]">
                  <span className="truncate font-medium">{cls.value}</span>
                  <span className="shrink-0 text-fg">{hometown.value.split(",")[0]}</span>
                </p>

                {/* Attacks */}
                <ul className="flex flex-col divide-y divide-line">
                  {attacks.map((group) => (
                    <li key={group.id} className="flex flex-col gap-0.5 py-1.5 first:pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="flex gap-0.5" aria-hidden="true">
                          {group.skills.slice(0, 2).map(({ name: n, icon: Icon }) => (
                            <span
                              key={n}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-fg text-surface-raised"
                            >
                              <Icon className="h-3 w-3" />
                            </span>
                          ))}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{group.category}</span>
                        <span className="text-[18px] font-semibold leading-none">{group.skills.length * 10}</span>
                      </div>
                      <p className="truncate text-[12px] leading-[1.4] text-fg-muted">
                        {group.skills.map((sk) => sk.name).join(", ")}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Stat bar, where a real card has weakness / resistance / retreat */}
                <dl className="grid grid-cols-3 divide-x divide-line border-y border-line py-1.5 text-center">
                  {stats.map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                      <dt className="text-[12px] leading-[1.4] text-fg-muted">{label}</dt>
                      <dd className="text-[13px] font-semibold leading-[1.4]">{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Flavour text and card number */}
                <div className="flex items-center justify-between gap-3 text-[12px] leading-[1.4] text-fg-muted">
                  {profile.degree && (
                    <span className="min-w-0 truncate italic">
                      {profile.degree}, {profile.school.split(" - ")[0]}
                    </span>
                  )}
                  <span className="flex shrink-0 items-center gap-1">
                    {trainerId}/{year}
                    <TbStarFilled aria-hidden="true" className="h-3 w-3 text-fg" />
                  </span>
                </div>
              </div>
            </FlipFace>

            {/* Back: monogram and the labelled badges */}
            <FlipFace
              side="back"
              hideWhenInactive
              className={`${face} [transform:rotateY(180deg)]`}
            >
              <div className={`${panel} relative`}>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:radial-gradient(rgb(var(--accent))_1.5px,transparent_1.5px)] [background-size:14px_14px]"
                />
                <div className="relative flex flex-col items-center gap-2 px-4 pt-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-accent">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent">
                      <span className="text-[22px] font-semibold leading-none">
                        {profile.name.split(" ").map((w) => w[0]).join("")}
                      </span>
                    </div>
                  </div>
                  <span className="text-accent-strong">
                    <PixelText text="BADGES" />
                    <span className="sr-only">Badges</span>
                  </span>
                </div>
                <div className="relative min-h-0 flex-1 overflow-y-auto px-4 pb-3">
                  <BadgeList earned={earned} />
                </div>
              </div>
            </FlipFace>
          </FlipInner>
        </Tilt>
      </div>

      <FlipButton
        label="Flip to see badges"
        flippedLabel="Show front"
        icon={<TbRotate aria-hidden="true" className="h-4 w-4" />}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 type-small text-fg-muted transition-[transform,color] duration-150 ease-out hover:text-fg active:scale-[0.97]"
      />
    </FlipRoot>
  );
}

const cards = {
  classic: ClassicCard,
  wide: WideCard,
  badges: BadgeCaseCard,
  flip: FlipCard,
  screen: ScreenCard,
  holo: HoloCard,
  id: IdBadgeCard,
  mini: MiniCard,
  tcg: TradingCard,
};

export default function TrainerCard({
  variant = "classic",
  projectCount = localProjects.length,
  contributions,
  badgeStyle = "earned",
}) {
  const Card = cards[variant] ?? ClassicCard;
  return (
    <Card
      rows={getRows(projectCount, contributions)}
      projectCount={projectCount}
      earned={badgeStyle !== "initials"}
    />
  );
}
