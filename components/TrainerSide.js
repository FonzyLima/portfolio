import React from "react";
import { experiences, profile } from "@/app/data/portfolioData";

/**
 * Left-hand column of the trainer-card intro: the "About me" heading, the
 * summary and a hairline list of what the card doesn't cover. All copy comes
 * from portfolioData.
 */

const [current, previous] = experiences;

export default function TrainerSide() {
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
      <h1 className="type-h2 text-fg">About me</h1>
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
    </div>
  );
}
