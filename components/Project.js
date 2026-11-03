import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";
import { ButtonIcon, buttonClass } from "./buttonStyles";
import { EASE_OUT, PrivateNote, SIZES, hoverClass, primaryAction } from "./project/shared";

// Lab-only pieces (/lab/cards), split into their own chunks and loaded only
// when a lab variant renders them, so the public pages (which use the
// defaults: Stage layout, Minimal tags, Labeled actions, Outline hover)
// don't ship them.
const OriginalCard = dynamic(() => import("./project/OriginalCard"));
const IconLinks = dynamic(() => import("./project/IconLinks"));
const CardTilt = dynamic(() => import("./CardTilt"));
const CategoryIcon = dynamic(() =>
  import("./projectIcons").then((mod) => mod.CategoryIcon),
);
const ToolIcon = dynamic(() => import("./projectIcons").then((mod) => mod.ToolIcon));

// Design variants, tried out at /lab/cards (src/app/lab/cards/page.js). The
// first option of each is the default and is what ships: the home page and
// /portfolio render <Project /> without these props.
//
// Layout: Stage (ships: screenshot floating on a green-tinted stage),
// Showcase (screenshot straight on the card), Rise (text on top, screenshot
// rising from the bottom edge), Post
// (title above the screenshot, description below), Row (horizontal, one per
// line), Zigzag (Row with the image switching sides), Frame (screenshot as
// its own tile, no card surface), Compact (small thumbnail beside the text),
// Index (a slim list row), and Original (the card before Showcase).
export const layoutVariants = [
  { id: "stage", label: "Stage" },
  { id: "showcase", label: "Showcase" },
  { id: "rise", label: "Rise" },
  { id: "post", label: "Post" },
  { id: "row", label: "Row" },
  { id: "zigzag", label: "Zigzag" },
  { id: "frame", label: "Frame" },
  { id: "compact", label: "Compact" },
  { id: "index", label: "Index" },
  { id: "stacked", label: "Original" },
];
// Layouts that are one card per line, so "Feature first" doesn't apply.
export const FULL_WIDTH_LAYOUTS = ["row", "zigzag", "index"];
// Inside: how the text block is arranged. Date in footer (ships: date right
// of the buttons), Stacked (tags, title, date, description, buttons),
// Title + date (date right of the title), Title first (tags move below the
// title), Centered (everything centred).
export const innerVariants = [
  { id: "footer", label: "Date in footer" },
  { id: "stack", label: "Stacked" },
  { id: "header", label: "Title + date" },
  { id: "titleFirst", label: "Title first" },
  { id: "center", label: "Centered" },
];
// Not for Original. Grid: "feature" makes the first card a wide horizontal
// one (PortfolioFilters passes `wide`). Tags: where the category + tools
// bar sits ("category" shows only the green pill, tools move to a text line).
// Text: how much description shows. Actions: how the project/GitHub links look.
export const gridVariants = [
  { id: "two", label: "Two-up" },
  { id: "feature", label: "Feature first" },
];
// Tags. Position: in the text column, across the image's bottom edge, or
// pinned to the image's top-left corner. Style: how the pills look. Tools:
// up to three (the third drops where a single-line bar would get cramped),
// two plus a "+N" count, or only the category pill with the tools as text.
export const tagVariants = [
  { id: "inside", label: "Inside" },
  { id: "overlap", label: "Overlap" },
  { id: "corner", label: "Corner" },
];
export const tagStyleVariants = [
  { id: "minimal", label: "Minimal" },
  { id: "chips", label: "Chips" },
  { id: "segmented", label: "Segmented" },
  { id: "outline", label: "Outline" },
  { id: "icons", label: "Icons" },
];
export const tagToolVariants = [
  { id: "fit", label: "Up to 3" },
  { id: "more", label: "2 + more" },
  { id: "text", label: "As text" },
];
export const textVariants = [
  { id: "title", label: "Title only" },
  { id: "short", label: "Short" },
  { id: "description", label: "Full" },
];
export const actionVariants = [
  { id: "labeled", label: "Labeled" },
  { id: "wide", label: "Wide" },
  { id: "icons", label: "Icons" },
];
export const hoverVariants = [
  { id: "outline", label: "Outline" },
  { id: "none", label: "None" },
  { id: "lift", label: "Lift" },
  { id: "zoom", label: "Zoom" },
  { id: "tilt", label: "Tilt" },
];
export const clickVariants = [
  { id: "links", label: "Links" },
  { id: "card", label: "Whole card" },
];

// "Outline" (see project/shared.js) drawn on a child (Frame's image tile) when
// the whole card is hovered.
const OUTLINE_CHILD = "outline outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-150 [@media(hover:hover)]:group-hover:outline-accent-strong";

// "Zoom": Showcase grows the whole baked frame into the card's 8px inset
// (Original's zoom lives in project/shared.js).
const ZOOM_SHOWCASE = `origin-bottom motion-safe:transition-transform motion-safe:duration-[240ms] ${EASE_OUT} motion-safe:group-hover:scale-[1.02] motion-safe:group-focus-within:scale-[1.02]`;

// The thumbnails (public/*.png, 605x422) have their frame baked in: a #2A2A2A
// panel with transparent ~26px top corners, bleeding off the bottom. Showcase
// insets it 8px in the card and keeps the corners concentric: frame radius is
// 4.3% of the image width, plus the 8px inset. `cqw` is the card's width (its
// wrapper is an inline-size container), so this holds at every breakpoint.
const SHOWCASE_RADIUS = "rounded-[calc(4.3cqw+7px)]";
// Featured card: from md the image takes ~55% of the width, so its baked
// radius is ~2.4% of the card.
const FEATURED_RADIUS = "rounded-[calc(4.3cqw+7px)] md:rounded-[calc(2.4cqw+7px)]";
// Compact: the image is ~40% of the card, so ~1.7% of the card.
const COMPACT_RADIUS = "rounded-[calc(1.7cqw+7px)]";
// Index: a fixed 112-128px thumbnail (baked radius ~5px) plus the 8px inset.
const INDEX_RADIUS = "rounded-[14px]";
// Stage: the stage sits 8px in, so its radius is the card's minus 8px.
const STAGE_RADIUS = "rounded-[calc(4.3cqw-1px)]";

// "Whole card": the title link's ::after covers the card (its nearest
// positioned ancestor, the <article>), so a click anywhere opens the project.
// The focus ring moves from the title text to that overlay, inset so it isn't
// clipped by the card's edge. Each layout's ::after matches its card radius.
const STRETCHED = {
  stacked:
    "after:absolute after:inset-0 after:z-[1] after:content-[''] after:rounded-lg focus-visible:outline-0 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-focus",
  showcase:
    "after:absolute after:inset-0 after:z-[1] after:content-[''] after:rounded-[calc(4.3cqw+7px)] focus-visible:outline-0 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-focus",
  featured:
    "after:absolute after:inset-0 after:z-[1] after:content-[''] after:rounded-[calc(4.3cqw+7px)] md:after:rounded-[calc(2.4cqw+7px)] focus-visible:outline-0 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-focus",
  compact:
    "after:absolute after:inset-0 after:z-[1] after:content-[''] after:rounded-[calc(1.7cqw+7px)] focus-visible:outline-0 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-focus",
  index:
    "after:absolute after:inset-0 after:z-[1] after:content-[''] after:rounded-[14px] focus-visible:outline-0 focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-focus",
};

function Title({ as: Heading, name, href, stretched, layout, className }) {
  return (
    <Heading
      className={`${className} ${stretched ? "transition-colors duration-150 group-hover:text-accent-strong" : ""}`}
    >
      {stretched ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={STRETCHED[layout]}
        >
          {name}
        </Link>
      ) : (
        name
      )}
    </Heading>
  );
}

/* Showcase card ---------------------------------------------------------- */

// The category + tools tags. A label, not a control, so it lets clicks
// through to the card. Styles:
//   segmented: one light bar (tag-bar token, same in both themes since it
//              often sits on the always-dark baked frame), category in green
//   chips:     separate pills, category green, tools on placeholder
//   outline:   hairline pills, category in accent-strong
//   minimal:   no pills: a green dot + the category, tools in muted text,
//              separated by space only (no separator characters)
//   icons:     chips with the category's and each tool's icon
// `onImage` (Overlap, Corner) keeps it on one line and, for the styles that
// have no fill of their own, sets it in a raised tray so it reads over the
// screenshot. When one line is required, the third tool drops where the card
// is narrow (phones, and the 2-up grid between md and lg); `roomy` (the wide
// featured/row card) only drops it on phones.
const PILL = "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5";

function Tags({ category, tools, style, mode, roomy = false, onImage = false, className = "" }) {
  const list = mode === "text" ? [] : tools.slice(0, mode === "more" ? 2 : 3);
  const extra = mode === "more" ? tools.length - list.length : 0;
  const oneLine = onImage || style === "segmented";
  const show = (i) =>
    mode === "fit" && oneLine && i === 2
      ? roomy
        ? "hidden sm:inline-flex"
        : "hidden sm:inline-flex md:hidden lg:inline-flex"
      : "inline-flex";
  const lineClass = oneLine
    ? "flex-nowrap overflow-hidden whitespace-nowrap"
    : "flex-wrap";
  const base = `pointer-events-none flex max-w-full items-center type-small ${lineClass} ${className}`;
  const tray =
    onImage && style !== "segmented"
      ? `rounded-full bg-surface-raised shadow-2 ${style === "minimal" ? "px-4 py-2" : "p-1"}`
      : "";
  const icon = "h-3.5 w-3.5 shrink-0";
  const more = extra > 0 ? `+${extra}` : null;
  // "+1" alone is unclear when read aloud.
  const label = (item) =>
    item === more ? (
      <>
        {item}
        <span className="sr-only"> more</span>
      </>
    ) : (
      item
    );

  if (style === "segmented") {
    const items = [...list, ...(more ? [more] : [])];
    return (
      <div className={`${base} rounded-full bg-tag-bar text-on-tag-bar shadow-2`}>
        <span className="inline-flex shrink-0 rounded-full bg-accent px-3.5 py-2 text-on-accent lg:px-4">
          {category}
        </span>
        {items.map((item, i) => (
          <span
            key={item}
            className={`${show(i)} shrink-0 px-3 py-2 lg:px-3.5 ${i === items.length - 1 ? "pr-4 lg:pr-5" : ""}`}
          >
            {label(item)}
          </span>
        ))}
      </div>
    );
  }

  if (style === "minimal") {
    return (
      <div className={`${base} gap-x-4 gap-y-1 ${tray}`}>
        <span className="inline-flex shrink-0 items-center gap-2 font-medium text-fg">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
          {category}
        </span>
        {[...list, ...(more ? [more] : [])].map((item, i) => (
          <span key={item} className={`${show(i)} shrink-0 text-fg-muted`}>
            {label(item)}
          </span>
        ))}
      </div>
    );
  }

  // chips, outline, icons
  const outline = style === "outline";
  const withIcons = style === "icons";
  const categoryClass = outline
    ? "border border-accent-strong py-[5px] text-accent-strong"
    : "bg-accent text-on-accent";
  const toolClass = outline
    ? "border border-line-strong py-[5px] text-fg"
    : "bg-placeholder text-fg";

  return (
    <div className={`${base} gap-1.5 ${tray}`}>
      <span className={`${PILL} ${categoryClass}`}>
        {withIcons && <CategoryIcon category={category} className={icon} />}
        {category}
      </span>
      {list.map((tool, i) => (
        <span key={tool} className={`${PILL} ${show(i)} ${toolClass}`}>
          {withIcons && <ToolIcon tool={tool} className={icon} />}
          {tool}
        </span>
      ))}
      {more && <span className={`${PILL} ${toolClass}`}>{label(more)}</span>}
    </div>
  );
}

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;
const ICON = "h-[18px] w-[18px] shrink-0";
// "Labeled" and "Wide": real buttons with words (components/buttonStyles.js).
// Primary is filled green and names the action ("Visit site", "Play"); GitHub
// is a soft secondary "Code" button. ↗ marks links that leave the site.
//
// In whole-card mode the card is the primary link, so the primary button is
// drawn the same but is only a cue (aria-hidden, follows the card's hover).
function ButtonLinks({ p, wide, center = false }) {
  if (!p.link && !p.git) return <PrivateNote />;

  const action = primaryAction(p.category, p.link);
  const primaryHref = p.link || p.git;
  const secondary = p.link && p.git;
  const primaryContent = (
    <>
      {action.icon === "git" && <FiGithub aria-hidden="true" className={ICON} />}
      {action.label}
      {action.icon === "arrow" && <ButtonIcon type="external" cardHover={p.stretched} />}
    </>
  );
  const width = wide ? "w-full" : "";
  // Every card has the same button text, so the project name tells them apart.
  const which = <span className="sr-only">: {p.name}</span>;

  return (
    <div
      className={
        wide
          ? `grid gap-2 ${secondary ? "grid-cols-2" : "grid-cols-1"}`
          : `flex flex-wrap gap-2 ${center ? "justify-center" : ""}`
      }
    >
      {p.stretched ? (
        <span
          aria-hidden="true"
          className={`${buttonClass("primary", { hover: "group" })} ${width}`}
        >
          {primaryContent}
        </span>
      ) : (
        <Link
          href={primaryHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass("primary")} ${width}`}
        >
          {primaryContent}
          {which}
          {NEW_TAB}
        </Link>
      )}
      {secondary && (
        <Link
          href={p.git}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative z-10 ${buttonClass("secondary")} ${width}`}
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

const clamp2 =
  "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]";

const SIZES_WIDE =
  "(min-width: 1120px) 576px, (min-width: 768px) 55vw, calc(100vw - 48px)";
const SIZES_COMPACT =
  "(min-width: 1120px) 200px, (min-width: 768px) 18vw, 40vw";
const SIZES_INDEX = "(min-width: 640px) 128px, 112px";

// Every layout except Original. `variant` is the layout id; `featured` (the
// first card with grid "feature") renders the wide horizontal layout, which
// is also what every card uses in "row" and "zigzag" (`flip` puts the image
// on the right, every other card).
function ShowcaseCard({ p, title, hover, tags, tagStyle, tagTools, text, actions, inner, variant, featured, flip, className }) {
  const zigzag = variant === "zigzag";
  const horizontal = featured || variant === "row" || zigzag;
  const index = variant === "index";
  const compact = variant === "compact" && !featured;
  const rise = variant === "rise" && !featured;
  const frame = variant === "frame" && !featured;
  const stage = variant === "stage" && !featured;
  const post = variant === "post" && !featured;
  // Small images have no room for tags on them, so the tags stay in the text,
  // category only.
  const small = compact || index;
  const center = inner === "center" && !index;

  // Where the tags go. Overlap: across the image's edge ("always"), or only
  // while a horizontal card is stacked on phones ("mobile"). Corner: pinned
  // to the image's top-left. Otherwise in the text column.
  const corner = tags === "corner" && !small;
  const seam =
    tags !== "overlap" || small ? "never" : horizontal ? "mobile" : "always";
  const toolsMode = small ? "text" : tagTools;
  const showText = featured ? "description" : text;

  const bar = (cls, onImage = false) => (
    <Tags
      category={p.category}
      tools={p.tools}
      style={tagStyle}
      mode={toolsMode}
      roomy={horizontal}
      onImage={onImage}
      className={cls}
    />
  );
  const seamBar = (edge) =>
    seam !== "never" &&
    bar(
      `absolute left-1/2 z-[2] max-w-[calc(100%-24px)] -translate-x-1/2 ${edge} ${seam === "mobile" ? "md:hidden" : ""}`,
      true,
    );

  // `outer` positions the image (and holds the seam bar, which must not be
  // clipped); `clip` is for layouts that round the image itself.
  const image = ({ outer = "", clip = "", sizes = SIZES, edge }) => (
    <div className={`relative ${outer}`}>
      <div className={`relative aspect-[605/422] w-full ${clip}`}>
        {/* Decorative: the heading already names the project. */}
        <Image
          alt=""
          src={p.image}
          fill
          sizes={sizes}
          className={`object-contain ${hover === "zoom" ? ZOOM_SHOWCASE : ""}`}
          preload={p.preload}
        />
      </div>
      {edge && seamBar(edge)}
      {corner &&
        bar("absolute left-4 top-4 z-[2] max-w-[calc(100%-32px)] lg:left-5 lg:top-5", true)}
    </div>
  );

  // Where the date goes: beside the icon links, beside the title, beside the
  // buttons, or on its own line under the title.
  const date = <span className="shrink-0 type-small text-fg-muted">{p.date}</span>;
  const datePlace =
    actions === "icons" ? "icons" : inner === "header" ? "header" : inner === "footer" ? "footer" : "below";

  // Footer sits at the bottom (mt-auto) so buttons line up across a row of
  // cards. Horizontal cards centre their text column instead.
  const push = horizontal ? "" : "mt-auto";
  const footer =
    actions === "icons" ? (
      <div className={`${push} flex min-h-[44px] items-center justify-between gap-3 pt-1`}>
        <span className="type-body text-fg-muted">{p.date}</span>
        <IconLinks p={p} />
      </div>
    ) : datePlace === "footer" ? (
      <div className={`${push} flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2`}>
        <ButtonLinks p={p} />
        {date}
      </div>
    ) : (
      <div className={`${push} pt-2`}>
        <ButtonLinks p={p} wide={actions === "wide"} center={center} />
      </div>
    );

  const tagsInText = seam !== "always" && !corner;
  const tagsClass = `${center ? "self-center" : "self-start"} ${seam === "mobile" ? "hidden md:flex" : ""}`;
  const toolsLine = tagTools === "text" && !small && p.tools.length > 0 && (
    <p className={`flex flex-wrap gap-x-4 gap-y-1 type-small text-fg-muted ${center ? "justify-center" : ""}`}>
      {p.tools.map((tool) => (
        <span key={tool}>{tool}</span>
      ))}
    </p>
  );

  // `head` is tags + title + date, `body` the description + buttons; Post puts
  // the screenshot between them, the rest render them together.
  const head = (
    <>
      {tagsInText && inner !== "titleFirst" && bar(`mb-2 ${tagsClass}`)}
      {datePlace === "header" ? (
        <div className="flex items-baseline justify-between gap-4">
          {title}
          {date}
        </div>
      ) : (
        title
      )}
      {datePlace === "below" && date}
      {tagsInText && inner === "titleFirst" && bar(`mt-1 ${tagsClass}`)}
      {toolsLine}
    </>
  );
  const body = (
    <>
      {showText !== "title" && (
        <p className={`type-body max-w-[65ch] text-fg-muted ${showText === "short" ? clamp2 : ""}`}>
          {p.description}
        </p>
      )}
      {footer}
    </>
  );
  const content = (
    <>
      {head}
      {body}
    </>
  );
  const align = center ? "items-center text-center" : "";

  const surface = `group relative h-full w-full bg-surface shadow-1 ${hoverClass(hover)}`;
  const seamPad = seam === "always" ? "pt-9 lg:pt-10" : seam === "mobile" ? "pt-9 md:pt-6" : "pt-5 lg:pt-6";

  let card;
  if (horizontal) {
    // Zigzag's flipped cards put the image on the right from md.
    const flipped = zigzag && flip && !featured;
    card = (
      <article
        className={`${surface} flex flex-col p-2 md:grid md:gap-2 ${flipped ? "md:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]" : "md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]"} ${FEATURED_RADIUS}`}
      >
        {image({
          outer: `self-start w-full ${flipped ? "md:order-2" : ""}`,
          sizes: SIZES_WIDE,
          edge: "bottom-0 translate-y-1/2",
        })}
        <div className={`flex flex-1 flex-col gap-2 px-3 pb-2 lg:px-4 lg:pb-3 ${seamPad} md:justify-center md:py-6 lg:px-6 ${align}`}>
          {content}
        </div>
      </article>
    );
  } else if (index) {
    // A slim list row: thumbnail, name + category, then the links (below the
    // text on phones, on the right from sm).
    card = (
      <article
        className={`${surface} grid grid-cols-[112px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 p-2 sm:grid-cols-[128px_minmax(0,1fr)_auto] sm:gap-x-6 ${INDEX_RADIUS}`}
      >
        {image({ outer: "self-center", sizes: SIZES_INDEX })}
        <div className="flex min-w-0 flex-col gap-1 py-1">
          {bar("self-start")}
          {datePlace === "below" || datePlace === "icons" ? (
            <div className="flex flex-wrap items-baseline gap-x-3">
              {title}
              {date}
            </div>
          ) : (
            title
          )}
          {showText !== "title" && (
            <p className={`hidden type-body max-w-[65ch] text-fg-muted sm:block ${showText === "short" ? "truncate" : ""}`}>
              {p.description}
            </p>
          )}
        </div>
        <div className="col-span-2 flex items-center justify-end gap-4 px-1 pb-1 sm:col-span-1 sm:px-0 sm:pb-0 sm:pr-2">
          {(datePlace === "header" || datePlace === "footer") && date}
          {actions === "icons" ? <IconLinks p={p} /> : <ButtonLinks p={p} />}
        </div>
      </article>
    );
  } else if (stage) {
    // The framed screenshot floats on a green-tinted stage, its open bottom
    // edge sitting on the stage's bottom edge.
    card = (
      <article className={`${surface} flex flex-col p-2 ${SHOWCASE_RADIUS}`}>
        <div className={`bg-accent/15 px-[9%] pt-[7%] dark:bg-accent/10 ${STAGE_RADIUS}`}>
          {image({ outer: "w-full", edge: "bottom-0 translate-y-1/2" })}
        </div>
        <div className={`flex flex-1 flex-col gap-2 px-3 pb-2 lg:px-4 lg:pb-3 ${seamPad} ${align}`}>
          {content}
        </div>
      </article>
    );
  } else if (post) {
    // Like a post: the heading first, then the screenshot, then the rest.
    card = (
      <article className={`${surface} flex flex-col p-2 ${SHOWCASE_RADIUS}`}>
        <div className={`flex flex-col gap-2 px-3 pb-4 pt-3 lg:px-4 lg:pt-4 ${align}`}>{head}</div>
        {image({ outer: "w-full", edge: "bottom-0 translate-y-1/2" })}
        <div className={`flex flex-1 flex-col gap-2 px-3 pb-2 lg:px-4 lg:pb-3 ${seamPad} ${align}`}>
          {body}
        </div>
      </article>
    );
  } else if (rise) {
    // Text first; the framed screenshot rises from the card's bottom edge.
    card = (
      <article className={`${surface} flex flex-col overflow-hidden ${SHOWCASE_RADIUS}`}>
        <div className={`flex flex-col gap-2 p-5 lg:p-6 ${seam === "always" ? "pb-10 lg:pb-11" : ""} ${align}`}>
          {content}
        </div>
        {image({ outer: "mt-auto mx-6 lg:mx-10", edge: "top-0 -translate-y-1/2" })}
      </article>
    );
  } else if (frame) {
    // No card surface: the screenshot is its own rounded tile (clipped at
    // the bottom to match its baked top corners), text sits on the page.
    card = (
      <article
        className={`group relative flex h-full w-full flex-col gap-4 ${hover === "outline" ? "" : hoverClass(hover)}`}
      >
        {image({
          outer: "w-full",
          clip: `overflow-hidden rounded-[4.3cqw] shadow-1 ${hover === "outline" ? OUTLINE_CHILD : ""}`,
          edge: "bottom-0 translate-y-1/2",
        })}
        <div className={`flex flex-1 flex-col gap-2 px-1 ${seam === "always" ? "pt-5" : ""} ${align}`}>
          {content}
        </div>
      </article>
    );
  } else if (compact) {
    card = (
      <article
        className={`${surface} grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-4 p-2 ${COMPACT_RADIUS}`}
      >
        {image({ outer: "self-center", sizes: SIZES_COMPACT })}
        <div className={`flex h-full flex-col justify-center gap-1.5 py-2 pr-2 ${align}`}>{content}</div>
      </article>
    );
  } else {
    card = (
      <article className={`${surface} flex flex-col p-2 ${SHOWCASE_RADIUS}`}>
        {image({ outer: "w-full", edge: "bottom-0 translate-y-1/2" })}
        <div className={`flex flex-1 flex-col gap-2 px-3 pb-2 lg:px-4 lg:pb-3 ${seamPad} ${align}`}>
          {content}
        </div>
      </article>
    );
  }

  return (
    <div className={`h-full w-full [container-type:inline-size] ${className}`}>{card}</div>
  );
}

// Grid around the cards: Row and Zigzag are one card per line, Index a tight
// list, everything else two-up.
export function gridClassFor(layout) {
  if (layout === "index") return "grid grid-cols-1 gap-3";
  return layout === "row" || layout === "zigzag"
    ? "grid grid-cols-1 gap-8 lg:gap-10"
    : "grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8";
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
  headingLevel = "h3",
  // Forwarded to next/image: preload the thumbnail from <head> (first row).
  preload = false,
  // Lab variants (see the lists above); the defaults are what ships.
  layout = "stage",
  grid = "two",
  tags = "inside",
  tagStyle = "minimal",
  tagTools = "fit",
  text = "title",
  actions = "labeled",
  inner = "footer",
  hover = "outline",
  click = "links",
  // Set by PortfolioFilters on the first card; with grid === "feature" it
  // renders as the wide horizontal card. (Not `featured`: that's the Sanity
  // field for "show on the home page", which callers spread in.)
  wide = false,
  // Set by PortfolioFilters on every other card, for Zigzag.
  flip = false,
}) {
  const href = link || git;
  const p = {
    name,
    date,
    category,
    description,
    image,
    link,
    git,
    preload,
    tools,
    stretched: click === "card" && Boolean(href),
  };
  const original = layout === "stacked";
  const isFeatured =
    !original && !FULL_WIDTH_LAYOUTS.includes(layout) && grid === "feature" && wide;
  const horizontal = isFeatured || layout === "row" || layout === "zigzag";
  // The featured card spans both grid columns (on its outermost element).
  const span = isFeatured ? "md:col-span-2" : "";

  // ::after radius for whole-card links, matching each card's corners.
  const radiusKey = original || (layout === "frame" && !isFeatured)
    ? "stacked"
    : horizontal
      ? "featured"
      : layout === "compact"
        ? "compact"
        : layout === "index"
          ? "index"
          : "showcase";

  const titleSize = original
    ? "type-h3"
    : horizontal
      ? "text-[24px] font-medium leading-[1.25] lg:text-[32px]"
      : layout === "compact" || layout === "index"
        ? "type-h3"
        : "text-[22px] font-medium leading-[1.25] lg:text-[26px]";

  const title = (
    <Title
      as={headingLevel}
      name={name}
      href={href}
      stretched={p.stretched}
      layout={radiusKey}
      className={`${titleSize} text-fg`}
    />
  );

  const card = original ? (
    <OriginalCard p={p} title={title} hover={hover} />
  ) : (
    <ShowcaseCard
      p={p}
      title={title}
      hover={hover}
      tags={tags}
      tagStyle={tagStyle}
      tagTools={tagTools}
      text={text}
      actions={actions}
      inner={inner}
      variant={layout}
      featured={isFeatured}
      flip={flip}
      className={hover === "tilt" ? "" : span}
    />
  );

  return hover === "tilt" ? <CardTilt className={`h-full ${span}`}>{card}</CardTilt> : card;
}
