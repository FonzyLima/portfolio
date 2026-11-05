import React from "react";
import { technicalSkills } from "./skills/skillsData";

// Server Component: the icons render to SVG on the server and no react-icons
// code ships.

const card = "rounded-lg bg-surface shadow-1";

// Logo sits in a small brand-tinted circle, like an app badge.
const chipClass =
  "inline-flex h-9 items-center gap-2 rounded-full border border-line bg-surface-raised py-1 pl-1 pr-3 text-[12px] leading-none text-fg lg:text-[13px]";

const iconSize = "h-3.5 w-3.5 shrink-0";

function ChipIcon({ icon: Icon, color }) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color ? "" : "bg-page"}`}
      style={color ? { backgroundColor: `${color}1F` } : undefined}
    >
      <Icon
        aria-hidden="true"
        className={`${iconSize} ${color ? "" : "text-fg"}`}
        style={color ? { color } : undefined}
      />
    </span>
  );
}

function SkillChips({ group }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={`${group.category} tools`}>
      {group.skills.map(({ name, icon, color }) => (
        <li key={name} className={chipClass}>
          <ChipIcon icon={icon} color={color} />
          {name}
        </li>
      ))}
    </ul>
  );
}

// One card surface holding every category as a row. `footer` (optional) is an
// extra last row inside the panel (the About page's GitHub activity).
export default function TechnicalSkills({ footer }) {
  return (
    <section
      id="technical-skills"
      className="page-container section-gap scroll-mt-24 font-custom"
    >
      <div className="flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="type-h2 text-fg">
            Technical skills
          </h2>
          <p className="type-lead max-w-[65ch] text-fg-muted">
            The stack I reach for to ship products end to end, from interface
            to API to deploy.
          </p>
        </div>
        <div
          className={`divide-y-[0.5px] divide-line overflow-hidden ${card}`}
        >
          {technicalSkills.map((group) => (
            <div
              key={group.id}
              className="grid grid-cols-1 gap-3 p-5 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center lg:gap-8 lg:p-6"
            >
              <h3 className="type-h3 text-fg">
                {group.category}
              </h3>
              <SkillChips group={group} />
            </div>
          ))}
          {footer}
        </div>
      </div>
    </section>
  );
}
