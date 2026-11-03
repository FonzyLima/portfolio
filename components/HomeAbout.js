import React from "react";
import Button from "./Button";
import Reveal from "./Reveal";
import { experiences, profile } from "@/app/data/portfolioData";

/**
 * Home "Who I am" section: a short teaser for /about. The intro leads at full
 * strength, a hairline fact list gives the scannable details, and a button
 * hands off to the full About page. All copy comes from portfolioData.
 */

const [current, previous] = experiences;
const firstYear = Math.min(
  ...experiences.map((e) => Number(e.period.match(/\d{4}/)?.[0] ?? Infinity))
);
const years = new Date().getFullYear() - firstYear;

const facts = [
  current && { label: "Currently", value: `${current.role} at ${current.company}` },
  previous && { label: "Previously", value: `${previous.role} at ${previous.company}` },
  Number.isFinite(years) && years > 0 && { label: "Experience", value: `${years}+ years` },
  profile.degree && { label: "Education", value: `${profile.degree}, ${profile.school}` },
].filter(Boolean);

export default function HomeAbout() {
  return (
    <section aria-labelledby="who-i-am" className="page-container section-gap flex flex-col gap-6 lg:gap-8">
      <Reveal>
        <h2 id="who-i-am" className="type-h2 text-fg">
          Who I am
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-16">
        <Reveal className="flex flex-col items-start gap-6 lg:gap-8">
          <p className="type-lead max-w-[65ch] text-fg">{profile.intro}</p>
          <Button title="More about me" destination="/about" icon="next" variant="secondary" />
        </Reveal>
        <Reveal delay={60}>
          <dl className="flex flex-col border-b border-line">
            {facts.map(({ label, value }) => (
              <div
                key={label}
                className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-t border-line py-3 lg:grid-cols-[120px_minmax(0,1fr)]"
              >
                <dt className="type-small text-fg-muted">{label}</dt>
                <dd className="type-small text-fg">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
