import React from "react";
import { technicalSkills } from "./skills/skillsData";
import SkillTilesFilter from "./skills/SkillTilesFilter";

// Server Component: the icons render to SVG on the server and no react-icons
// code ships. Only the Tiles filter (./skills/SkillTilesFilter) is client code.

export const skillVariants = [
  { id: "cards", label: "Cards" },
  { id: "rows", label: "Rows" },
  { id: "panel", label: "Panel" },
  { id: "columns", label: "Columns" },
  { id: "tiles", label: "Tiles" },
];

const hairline = "border-line-strong";
const card = "rounded-lg bg-surface shadow-1";

export const chipStyles = [
  { id: "soft", label: "Soft" },
  { id: "brand", label: "Brand" },
  { id: "badge", label: "Badge" },
  { id: "accent", label: "Accent" },
  { id: "inset", label: "Inset" },
  { id: "hover", label: "Hover" },
  { id: "outline", label: "Outline" },
];

const chipBase =
  "inline-flex items-center rounded-full text-[12px] leading-none text-fg lg:text-[13px]";

const chipClass = {
  // White/raised fill, hairline border, logos in the text colour.
  soft: `${chipBase} h-8 gap-2 border border-line bg-surface-raised pl-2.5 pr-3`,
  // Soft, with each logo in its brand colour.
  brand: `${chipBase} h-8 gap-2 border border-line bg-surface-raised pl-2.5 pr-3`,
  // Logo sits in a small brand-tinted circle, like an app badge.
  badge: `${chipBase} h-9 gap-2 border border-line bg-surface-raised py-1 pl-1 pr-3`,
  // Light wash of the site green.
  accent: `${chipBase} h-8 gap-2 border border-accent/30 bg-accent/10 pl-2.5 pr-3`,
  // Pressed into the surface instead of sitting on it.
  inset: `${chipBase} h-8 gap-2 bg-placeholder/60 pl-2.5 pr-3 shadow-[inset_0_1px_2px_rgb(0_0_0/0.12)]`,
  // Monochrome until hovered, then the logo takes its brand colour.
  hover: `group ${chipBase} h-8 gap-2 border border-line bg-surface-raised pl-2.5 pr-3 transition-[border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:border-line-strong motion-reduce:hover:translate-y-0`,
  // The original high-contrast outline, kept for comparison.
  outline: `${chipBase} h-7 gap-1.5 border border-line-strong px-3`,
};

const iconSize = "h-3.5 w-3.5 shrink-0";

function ChipIcon({ icon: Icon, color, chip }) {
  const brandStyle = color ? { color } : undefined;
  const brandClass = color ? "" : "text-fg";

  switch (chip) {
    case "brand":
      return (
        <Icon aria-hidden="true" className={`${iconSize} ${brandClass}`} style={brandStyle} />
      );
    case "badge":
      return (
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color ? "" : "bg-page"}`}
          style={color ? { backgroundColor: `${color}1F` } : undefined}
        >
          <Icon aria-hidden="true" className={`${iconSize} ${brandClass}`} style={brandStyle} />
        </span>
      );
    case "accent":
      return <Icon aria-hidden="true" className={`${iconSize} text-accent-strong`} />;
    case "hover":
      return (
        <Icon
          aria-hidden="true"
          className={`${iconSize} text-fg-muted transition-colors duration-200 group-hover:text-[color:var(--brand)]`}
          style={{ "--brand": color ?? "rgb(var(--fg))" }}
        />
      );
    case "inset":
    case "outline":
      return <Icon aria-hidden="true" className={`${iconSize} text-fg-muted`} />;
    default:
      return <Icon aria-hidden="true" className={`${iconSize} text-fg`} />;
  }
}

function SkillChips({ group, chip }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={`${group.category} tools`}>
      {group.skills.map(({ name, icon, color }) => (
        <li key={name} className={chipClass[chip] ?? chipClass.soft}>
          <ChipIcon icon={icon} color={color} chip={chip} />
          {name}
        </li>
      ))}
    </ul>
  );
}

/* Cards: bento grid, two wide cards on top and three below on lg. */
function CardsLayout({ chip }) {
  const total = technicalSkills.length;
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6 lg:gap-6">
      {technicalSkills.map((group, index) => {
        const lg = index < 2 ? "lg:col-span-3" : "lg:col-span-2";
        const md = index === total - 1 && total % 2 === 1 ? "md:col-span-2" : "";
        return (
          <article
            key={group.id}
            className={`flex flex-col gap-4 p-5 lg:p-6 ${card} ${md} ${lg}`}
          >
            <div className="flex flex-col gap-2">
              <h3 className="type-h3 text-fg">
                {group.category}
              </h3>
              <p className="type-body max-w-[65ch] text-fg-muted">
                {group.description}
              </p>
            </div>
            <div className="mt-auto pt-1">
              <SkillChips group={group} chip={chip} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* Rows: same two-column grid as the resume below it, split by hairlines. */
function RowsLayout({ chip }) {
  return (
    <div className={`flex flex-col border-b-[0.5px] ${hairline}`}>
      {technicalSkills.map((group) => (
        <div
          key={group.id}
          className={`grid grid-cols-1 gap-y-4 border-t-[0.5px] py-6 lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.6fr)] lg:gap-x-8 lg:py-8 xl:grid-cols-[minmax(260px,1fr)_minmax(0,1.6fr)] ${hairline}`}
        >
          <div className="flex flex-col gap-y-1.5">
            <h3 className="type-h3 text-fg">
              {group.category}
            </h3>
            <p className="type-small text-fg-muted">
              {group.description}
            </p>
          </div>
          <div className="lg:pt-0.5">
            <SkillChips group={group} chip={chip} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Panel: one card surface holding every category as a row. `footer` is an
   extra last row inside the panel (the About page's GitHub activity). */
function PanelLayout({ chip, footer }) {
  return (
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
          <SkillChips group={group} chip={chip} />
        </div>
      ))}
      {footer}
    </div>
  );
}

/* Columns: spec-sheet style, a plain list per category. */
function ColumnsLayout() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
      {technicalSkills.map((group) => (
        <div
          key={group.id}
          className={`flex flex-col gap-4 border-t-[0.5px] pt-5 ${hairline}`}
        >
          <h3 className="type-h3 text-fg lg:min-h-[2.6em]">
            {group.category}
          </h3>
          <ul className="flex flex-col gap-3">
            {group.skills.map(({ name, icon: Icon }) => (
              <li
                key={name}
                className="flex items-center gap-2.5 type-body text-fg-muted"
              >
                <Icon
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-fg"
                />
                {name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* Tiles: the Portfolio page's filter chips over a grid of tool tiles. The
   tiles render here; SkillTilesFilter only holds the selected filter. */
function TilesLayout() {
  const filters = [
    { id: "all", label: "All", groups: technicalSkills },
    ...technicalSkills.map((g) => ({ id: g.id, label: g.short, groups: [g] })),
  ].map(({ id, label, groups }) => ({
    id,
    label,
    count: groups.reduce((n, g) => n + g.skills.length, 0),
  }));
  const tiles = technicalSkills.flatMap((g) =>
    g.skills.map(({ name, icon: Icon }) => ({
      key: name,
      group: g.id,
      node: (
        <li className={`flex flex-col gap-6 p-4 lg:p-5 ${card}`}>
          <Icon
            aria-hidden="true"
            className="h-6 w-6 text-fg"
          />
          <div className="flex flex-col gap-0.5">
            <span className="type-small font-medium text-fg">
              {name}
            </span>
            <span className="text-[12px] text-fg-muted lg:text-[13px]">
              {g.short}
            </span>
          </div>
        </li>
      ),
    }))
  );

  return <SkillTilesFilter filters={filters} tiles={tiles} />;
}

const layouts = {
  cards: CardsLayout,
  rows: RowsLayout,
  panel: PanelLayout,
  columns: ColumnsLayout,
  tiles: TilesLayout,
};

// `footer` (optional) is a row rendered after the skills: inside the panel for
// the panel variant, in its own card for the others.
export default function TechnicalSkills({ variant = "cards", chip = "soft", footer }) {
  const Layout = layouts[variant] ?? CardsLayout;
  const inPanel = Layout === PanelLayout;
  return (
    <section
      id="technical-skills"
      className="page-container section-gap scroll-mt-24 font-custom"
    >
      <div className="flex flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="type-h2 text-fg">
            Technical Skills
          </h2>
          <p className="type-lead max-w-[65ch] text-fg-muted">
            The stack I reach for to ship products end to end, from interface
            to infrastructure.
          </p>
        </div>
        <Layout chip={chip} footer={inPanel ? footer : undefined} />
        {footer && !inPanel && <div className={card}>{footer}</div>}
      </div>
    </section>
  );
}
