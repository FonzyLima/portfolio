import React from "react";
import Image from "next/image";
import {
  experiences,
  profile,
  projects as localProjects,
  socials,
} from "@/app/data/portfolioData";
import { TbCode, TbRotate, TbStarFilled } from "react-icons/tb";
import { GLYPH_ROWS, textPath, textWidth } from "./gameboy/pixelFont";
import { technicalSkills } from "./skills/skillsData";
import { FlipButton, FlipFace, FlipInner, FlipRoot, Tilt } from "./trainer/TiltFlip";

/**
 * Pokémon trading-card-style trainer card for the About page. Everything on it
 * is derived from portfolioData: the trainer ID is hashed from the GitHub
 * handle, HP comes from the number of projects (pass `projectCount` from the
 * same source the Portfolio page uses), time played runs from the first job to
 * today, and each company is a gym badge on the back.
 *
 * Server Component: the icons and badges render to SVG on the server and no
 * react-icons code ships. The tilt and flip are client leaves in
 * ./trainer/TiltFlip that receive server-rendered nodes.
 */

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

// Months in a role, counting both end months.
const monthsIn = (e) => {
  const [start, end] = e.period.split(/\s+-\s+/).map(toMonths);
  return Math.max(1, end - start + 1);
};
const tenureLabel = (e) => {
  const total = monthsIn(e);
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
};

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

// Outline shape with the company's initials; the current job's is filled green.
function Badge({ job, index }) {
  const current = isCurrent(job);
  return (
    <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden="true" focusable="false">
      <path
        d={BADGE_SHAPES[index % BADGE_SHAPES.length]}
        strokeWidth="2"
        className={
          current
            ? "fill-accent stroke-accent-strong"
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

// Every badge with its label always visible.
function BadgeList() {
  return (
    <ul className="flex flex-col divide-y divide-line">
      {experiences.map((e, i) => (
        <li key={keyOf(e)} className="flex items-center gap-3 py-2.5">
          <Badge job={e} index={i} />
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
    </ul>
  );
}

/* ---------- card ---------- */

/* Trading card: a collectible-card take, at real card proportions (63x88).
   Front: LV, name, HP and type; an art window that takes whatever height is
   left (so nothing is ever pushed off the card); two "attacks" built from the
   skill groups; a stat bar; flavour text and a card number. Back: monogram and
   the labelled badge list. Tilts with a foil glare on mouse hover and flips.
   Everything is derived from data: HP = projects x 10, LV = years of
   experience, attack damage = tools x 10. */
export default function TrainerCard({ projectCount = localProjects.length }) {
  const played = getTimePlayed();
  const level = parseInt(played, 10) || 1;
  const attacks = technicalSkills.slice(0, 2);
  const year = new Date().getFullYear();
  const stats = [
    { label: "Projects", value: projectCount },
    { label: "Time played", value: played },
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
                    {profile.name}
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
                  <span className="truncate font-medium">{profile.title}</span>
                  <span className="shrink-0 text-fg">{profile.location.split(",")[0]}</span>
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
                  <BadgeList />
                </div>
              </div>
            </FlipFace>
          </FlipInner>
        </Tilt>
      </div>

      <FlipButton
        label="Flip to see badges"
        flippedLabel="Flip back"
        icon={<TbRotate aria-hidden="true" className="h-4 w-4" />}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 type-small text-fg-muted transition-[transform,color] duration-150 ease-out hover:text-fg active:scale-[0.97]"
      />
    </FlipRoot>
  );
}
