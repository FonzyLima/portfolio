import React from "react";
import Image from "next/image";
import { TbBriefcase, TbClock, TbMapPin, TbSchool } from "react-icons/tb";
import { experiences, profile } from "@/app/data/portfolioData";
import TrainerCard from "./TrainerCard";
import TrainerSide from "./TrainerSide";

export const introVariants = [
  { id: "current", label: "Current" },
  { id: "split", label: "Split" },
  { id: "card", label: "Card" },
  { id: "statement", label: "Statement" },
  { id: "stats", label: "Stats" },
  { id: "trainer", label: "Trainer card" },
];

// Everything below is derived from portfolioData, so editing that file
// updates every variant.
const current = experiences[0];
const firstYear = Math.min(
  ...experiences.map((e) => Number(e.period.match(/\d{4}/)?.[0] ?? Infinity))
);
const years = new Date().getFullYear() - firstYear;
const [city, country] = profile.location.split(",").map((s) => s.trim());

const facts = [
  { label: "Currently", value: `${current.role} at ${current.company}`, icon: TbBriefcase },
  { label: "Based in", value: profile.location, icon: TbMapPin },
  { label: "Experience", value: `${years}+ years`, icon: TbClock },
  { label: "Education", value: `${profile.degree}, ${profile.school}`, icon: TbSchool },
];

function Heading() {
  return <h1 className="type-h2 text-fg">More About Me</h1>;
}

function Photo({ className = "", sizes, imgClassName = "" }) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-placeholder ${className}`}>
      <Image
        src="/about-profile.jpg"
        alt={profile.name}
        fill
        sizes={sizes}
        className={`object-cover ${imgClassName}`}
        preload
      />
    </div>
  );
}

/* Current: what /about shows today, kept as the baseline. */
function CurrentIntro() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Heading />
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div className="flex w-full flex-col gap-6 lg:min-w-0 lg:flex-1">
          <p className="type-lead max-w-[65ch] text-fg-muted">{profile.summary}</p>
          <p className="type-lead max-w-[65ch] text-fg-muted">{profile.intro}</p>
        </div>
        <Photo
          className="h-[200px] w-[200px] rounded-full border border-line-strong shadow-1 lg:h-[240px] lg:w-[240px]"
          sizes="(min-width: 1024px) 240px, 200px"
        />
      </div>
    </div>
  );
}

/* Split: tall portrait beside the text, with a hairline fact list.
   The text comes first in the DOM so the heading leads on phones and for
   screen readers; on lg the grid places the photo in the left column. */
function SplitIntro() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start lg:gap-16">
      <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-1 lg:gap-8">
        <Heading />
        <div className="flex flex-col gap-4">
          <p className="type-lead max-w-[65ch] text-fg">{profile.summary}</p>
          <p className="type-body max-w-[65ch] text-fg-muted">{profile.intro}</p>
        </div>
        <dl className="flex flex-col border-b border-line">
          {facts.map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-t border-line py-3 lg:grid-cols-[140px_minmax(0,1fr)]"
            >
              <dt className="type-small text-fg-muted">{label}</dt>
              <dd className="type-small text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Photo
        className="aspect-[4/5] w-full max-w-[240px] rounded-lg shadow-1 lg:col-start-1 lg:row-start-1 lg:max-w-none"
        sizes="(min-width: 1024px) 420px, 240px"
      />
    </div>
  );
}

/* Card: text on the left, a profile card on the right. */
function CardIntro() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-16">
      <div className="flex flex-col gap-6 lg:gap-8">
        <Heading />
        <p className="type-lead max-w-[65ch] text-fg-muted">{profile.summary}</p>
        <p className="type-lead max-w-[65ch] text-fg-muted">{profile.intro}</p>
      </div>
      <aside className="w-full max-w-[400px] overflow-hidden rounded-lg bg-surface shadow-1">
        <Photo
          className="aspect-square w-full"
          imgClassName="object-[center_20%]"
          sizes="(min-width: 1024px) 340px, 400px"
        />
        <div className="flex flex-col gap-4 p-5 lg:p-6">
          <div className="flex flex-col gap-1">
            <div className="type-h3 text-fg">{profile.name}</div>
            <div className="type-small text-fg-muted">{profile.title}</div>
          </div>
          <ul className="flex flex-col gap-3 border-t border-line pt-4">
            {facts.map(({ label, value, icon: Icon }) => (
              <li key={label} className="flex items-start gap-3 type-small text-fg">
                <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-fg-muted" />
                <span>
                  <span className="sr-only">{label}: </span>
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

/* Statement: the summary set large as a pull quote, details underneath. */
function StatementIntro() {
  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <div className="flex items-center gap-4">
        <Photo
          className="h-14 w-14 rounded-full border border-line-strong lg:h-16 lg:w-16"
          sizes="64px"
        />
        <Heading />
      </div>
      <p className="max-w-[34ch] text-[22px] font-medium leading-[1.4] text-fg [text-wrap:pretty] lg:text-[30px] lg:leading-[1.35]">
        {profile.summary}
      </p>
      <div className="grid grid-cols-1 gap-8 border-t border-line pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <p className="type-body max-w-[65ch] text-fg-muted">{profile.intro}</p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
          {facts.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="text-[12px] text-fg-muted lg:text-[13px]">{label}</dt>
              <dd className="type-small text-fg">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* Stats: current text layout with a portrait, plus a row of quick numbers. */
function StatsIntro() {
  const stats = [
    { value: `${years}+`, label: "Years building software" },
    { value: String(experiences.length), label: "Companies" },
    { value: current.role, label: `Now at ${current.company}` },
    { value: city, label: country ? `Based in ${country}` : "Based in" },
  ];

  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <div className="flex w-full flex-col gap-6 lg:min-w-0 lg:flex-1 lg:gap-8">
          <Heading />
          <p className="type-lead max-w-[65ch] text-fg">{profile.summary}</p>
          <p className="type-body max-w-[65ch] text-fg-muted">{profile.intro}</p>
        </div>
        <Photo
          className="aspect-[4/5] w-[200px] rounded-lg shadow-1 lg:w-[260px]"
          sizes="(min-width: 1024px) 260px, 200px"
        />
      </div>
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-line shadow-1 lg:grid-cols-4">
        {stats.map(({ value, label }) => (
          <div key={label} className="flex flex-col gap-1 bg-surface p-5 lg:p-6">
            <dd className="type-h2 text-fg">{value}</dd>
            <dt className="type-small text-fg-muted">{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* Trainer card: text beside a Pokémon trainer card (see
   components/TrainerCard.js). The Wide card sits full width under the text.
   This is what /about uses. */
function TrainerIntro({ card, side, badgeStyle, projectCount, contributions }) {
  const text = <TrainerSide variant={side} />;
  const trainer = (
    <TrainerCard
      variant={card}
      badgeStyle={badgeStyle}
      projectCount={projectCount}
      contributions={contributions}
    />
  );

  if (card === "wide") {
    return (
      <div className="flex flex-col gap-10 lg:gap-12">
        {text}
        {trainer}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-16">
      {text}
      {trainer}
    </div>
  );
}

const intros = {
  current: CurrentIntro,
  split: SplitIntro,
  card: CardIntro,
  statement: StatementIntro,
  stats: StatsIntro,
  trainer: TrainerIntro,
};

// `card`, `side`, `badgeStyle`, `projectCount` and `contributions` only apply
// to the trainer variant.
export default function AboutIntro({
  variant = "current",
  card,
  side,
  badgeStyle,
  projectCount,
  contributions,
}) {
  const Intro = intros[variant] ?? CurrentIntro;
  return (
    <section
      id="about-intro"
      className="page-container scroll-mt-24 pt-24 font-custom lg:pt-32"
    >
      <Intro
        card={card}
        side={side}
        badgeStyle={badgeStyle}
        projectCount={projectCount}
        contributions={contributions}
      />
    </section>
  );
}
