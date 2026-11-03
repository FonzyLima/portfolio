import React from "react";
import Link from "next/link";
import Button from "./Button";
import DialogSide from "./trainer/DialogSide";
import { experiences, profile } from "@/app/data/portfolioData";

/**
 * Left-hand column of the trainer-card intro: the "More About Me" heading and
 * text, in a few layouts. All copy comes from portfolioData. Server Component;
 * only the paged Dialog layout (./trainer/DialogSide) is client code.
 */

export const sideVariants = [
  { id: "text", label: "Text" },
  { id: "dialog", label: "Dialog" },
  { id: "facts", label: "Facts" },
  { id: "statement", label: "Statement" },
  { id: "now", label: "Now" },
];

const [current, previous] = experiences;

function Heading() {
  return <h1 className="type-h2 text-fg">More About Me</h1>;
}

/* Text: heading, summary at full strength, intro muted. */
function TextSide() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Heading />
      <div className="flex flex-col gap-4">
        <p className="type-lead max-w-[65ch] text-fg">{profile.summary}</p>
        <p className="type-body max-w-[65ch] text-fg-muted">{profile.intro}</p>
      </div>
    </div>
  );
}

/* Facts: summary plus a hairline list of what the card doesn't cover. */
function FactsSide() {
  const facts = [
    { label: "Currently", value: `${current.role} at ${current.company}` },
    previous && { label: "Previously", value: `${previous.role} at ${previous.company}` },
    profile.degree && {
      label: "Education",
      value: `${profile.degree}, ${profile.school}`,
    },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Heading />
      <p className="type-lead max-w-[65ch] text-fg">{profile.summary}</p>
      <dl className="flex max-w-[65ch] flex-col border-b border-line">
        {facts.map(({ label, value }) => (
          <div
            key={label}
            className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-t border-line py-3 lg:grid-cols-[130px_minmax(0,1fr)]"
          >
            <dt className="type-small text-fg-muted">{label}</dt>
            <dd className="type-small text-fg">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="type-body max-w-[65ch] text-fg-muted">{profile.intro}</p>
    </div>
  );
}

/* Statement: the summary set large, intro under it, and two next steps. */
function StatementSide() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Heading />
      <p className="max-w-[32ch] text-[22px] font-medium leading-[1.4] text-fg [text-wrap:pretty] lg:text-[28px] lg:leading-[1.35]">
        {profile.summary}
      </p>
      <p className="type-body max-w-[65ch] text-fg-muted">{profile.intro}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button title="See my work" destination="/portfolio" icon="next" />
        <Link
          href="#footer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-line-strong px-5 text-[15px] font-medium text-fg transition-[transform,color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-accent-strong hover:text-accent-strong active:scale-[0.97]"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}

/* Now: summary plus a "what I'm doing now" block linking to the resume. */
function NowSide() {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Heading />
      <p className="type-lead max-w-[65ch] text-fg">{profile.summary}</p>
      <div className="flex max-w-[65ch] flex-col gap-3 rounded-lg border border-line p-5 lg:p-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="text-[12px] text-fg-muted lg:text-[13px]">Now</span>
        </div>
        <h2 className="flex flex-wrap items-baseline gap-x-2">
          <span className="type-h3 text-fg">{current.role}</span>
          <span className="type-body text-accent-strong">at {current.company}</span>
        </h2>
        <p className="type-body text-fg-muted">{current.highlights[0]}</p>
        <Link
          href="#resume"
          className="inline-flex min-h-[44px] items-center self-start type-small text-fg underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong"
        >
          See the full resume
        </Link>
      </div>
    </div>
  );
}

/* Dialog: the copy in an RPG-style dialog box you page through (client leaf). */
function DialogLayout() {
  return <DialogSide heading={<Heading />} />;
}

const sides = {
  text: TextSide,
  dialog: DialogLayout,
  facts: FactsSide,
  statement: StatementSide,
  now: NowSide,
};

export default function TrainerSide({ variant = "text" }) {
  const Side = sides[variant] ?? TextSide;
  return <Side />;
}
