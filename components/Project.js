import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiGithub, FiLock } from "react-icons/fi";
import { ButtonIcon, buttonClass } from "./buttonStyles";

const SIZES =
  "(min-width: 1120px) 512px, (min-width: 768px) calc(50vw - 36px), calc(100vw - 48px)";
const SIZES_WIDE =
  "(min-width: 1120px) 576px, (min-width: 768px) 55vw, calc(100vw - 48px)";

// Hover: a 2px accent ring a few px outside the card (pointer devices only).
// Keyboard focus already gets the global focus ring.
const OUTLINE = "outline outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-150 [@media(hover:hover)]:hover:outline-accent-strong";

// The thumbnails (public/*.png, 605x422) have their frame baked in: a #2A2A2A
// panel with transparent ~26px top corners, bleeding off the bottom. The card
// insets it 8px and keeps the corners concentric: frame radius is 4.3% of the
// image width, plus the 8px inset. `cqw` is the card's width (its wrapper is
// an inline-size container), so this holds at every breakpoint.
const SHOWCASE_RADIUS = "rounded-[calc(4.3cqw+7px)]";
// Featured card: from md the image takes ~55% of the width, so its baked
// radius is ~2.4% of the card.
const FEATURED_RADIUS = "rounded-[calc(4.3cqw+7px)] md:rounded-[calc(2.4cqw+7px)]";
// Stage: the stage sits 8px in, so its radius is the card's minus 8px.
const STAGE_RADIUS = "rounded-[calc(4.3cqw-1px)]";

// What the main link does, in words. The live link's destination depends on
// the kind of project; without one, the main action is the code itself.
function primaryAction(category, link) {
  if (!link) return { label: "View code", icon: "git" };
  if (category === "Game") return { label: "Play", icon: "arrow" };
  if (category === "Mobile App") return { label: "Get the app", icon: "arrow" };
  return { label: "Visit site", icon: "arrow" };
}

function PrivateNote() {
  return (
    <span className="inline-flex min-h-[44px] items-center gap-2 type-small text-fg-muted">
      <FiLock aria-hidden="true" className="h-4 w-4" />
      Private project, no public link
    </span>
  );
}

// The category + tools tags. A label, not a control, so it lets clicks
// through to the card. No pills: a green dot + the category, then up to three
// tools in muted text, separated by space only (no separator characters).
function Tags({ category, tools, className = "" }) {
  return (
    <div
      className={`pointer-events-none flex max-w-full flex-wrap items-center gap-x-4 gap-y-1 type-small ${className}`}
    >
      <span className="inline-flex shrink-0 items-center gap-2 font-medium text-fg">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
        {category}
      </span>
      {tools.slice(0, 3).map((tool) => (
        <span key={tool} className="inline-flex shrink-0 text-fg-muted">
          {tool}
        </span>
      ))}
    </div>
  );
}

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;
const ICON = "h-[18px] w-[18px] shrink-0";
// Real buttons with words (components/buttonStyles.js). Primary is filled
// green and names the action ("Visit site", "Play"); GitHub is a soft
// secondary "Code" button. ↗ marks links that leave the site.
function ButtonLinks({ p }) {
  if (!p.link && !p.git) return <PrivateNote />;

  const action = primaryAction(p.category, p.link);
  const primaryHref = p.link || p.git;
  const secondary = p.link && p.git;
  // Every card has the same button text, so the project name tells them apart.
  const which = <span className="sr-only">: {p.name}</span>;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass("primary")}
      >
        {action.icon === "git" && <FiGithub aria-hidden="true" className={ICON} />}
        {action.label}
        {action.icon === "arrow" && <ButtonIcon type="external" />}
        {which}
        {NEW_TAB}
      </Link>
      {secondary && (
        <Link
          href={p.git}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative z-10 ${buttonClass("secondary")}`}
        >
          <FiGithub aria-hidden="true" className={ICON} />
          Code
          {which}
          {NEW_TAB}
        </Link>
      )}
    </div>
  );
}

// `featured` renders the wide horizontal card (image beside the text from md)
// with the description; otherwise the Stage card, title only.
function ShowcaseCard({ p, title, featured, className }) {
  const image = ({ outer, sizes = SIZES }) => (
    <div className={`relative ${outer}`}>
      <div className="relative aspect-[605/422] w-full">
        {/* Decorative: the heading already names the project. */}
        <Image
          alt=""
          src={p.image}
          fill
          sizes={sizes}
          className="object-contain"
          preload={p.preload}
        />
      </div>
    </div>
  );

  // Footer sits at the bottom (mt-auto) so buttons line up across a row of
  // cards, with the date right of the buttons. The featured card centres its
  // text column instead.
  const content = (
    <>
      <Tags category={p.category} tools={p.tools} className="mb-2 self-start" />
      {title}
      {featured && (
        <p className="type-body max-w-[65ch] text-fg-muted">{p.description}</p>
      )}
      <div
        className={`${featured ? "" : "mt-auto"} flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2`}
      >
        <ButtonLinks p={p} />
        <span className="shrink-0 type-small text-fg-muted">{p.date}</span>
      </div>
    </>
  );

  const surface = `group relative h-full w-full bg-surface shadow-1 ${OUTLINE}`;

  const card = featured ? (
    <article
      className={`${surface} flex flex-col p-2 md:grid md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] md:gap-2 ${FEATURED_RADIUS}`}
    >
      {image({ outer: "self-start w-full", sizes: SIZES_WIDE })}
      <div className="flex flex-1 flex-col gap-2 px-3 pb-2 pt-5 md:justify-center md:py-6 lg:px-6 lg:pb-3 lg:pt-6">
        {content}
      </div>
    </article>
  ) : (
    // The framed screenshot floats on a green-tinted stage, its open bottom
    // edge sitting on the stage's bottom edge.
    <article className={`${surface} flex flex-col p-2 ${SHOWCASE_RADIUS}`}>
      <div className={`bg-accent/15 px-[9%] pt-[7%] dark:bg-accent/10 ${STAGE_RADIUS}`}>
        {image({ outer: "w-full" })}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pb-2 pt-5 lg:px-4 lg:pb-3 lg:pt-6">
        {content}
      </div>
    </article>
  );

  return (
    <div className={`h-full w-full [container-type:inline-size] ${className}`}>{card}</div>
  );
}

export default function Project({
  name,
  date,
  category,
  description,
  image,
  link = "",
  git = "",
  tools = [],
  headingLevel: Heading = "h3",
  // Forwarded to next/image: preload the thumbnail from <head> (first row).
  preload = false,
  // Set by PortfolioFilters on the first card when the count is odd: renders
  // the wide horizontal card spanning both grid columns. (Not `featured`:
  // that's the Sanity field for "show on the home page", which callers
  // spread in.)
  wide = false,
}) {
  const p = { name, date, category, description, image, link, git, preload, tools };

  const titleSize = wide
    ? "text-[24px] font-medium leading-[1.25] lg:text-[32px]"
    : "text-[22px] font-medium leading-[1.25] lg:text-[26px]";

  return (
    <ShowcaseCard
      p={p}
      title={<Heading className={`${titleSize} text-fg`}>{name}</Heading>}
      featured={wide}
      className={wide ? "md:col-span-2" : ""}
    />
  );
}
