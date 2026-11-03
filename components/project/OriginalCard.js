import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EASE_OUT, SIZES, ZOOM, hoverClass } from "./shared";

// The "Original" layout (the card before Showcase), only reachable from
// /lab/cards. Project.js loads it with next/dynamic so public pages don't
// ship it.

function TextLink({ href, className = "", children }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[44px] items-center type-small underline text-fg hover:text-accent-strong transition-colors duration-200 ${className}`}
    >
      {children}
    </Link>
  );
}

function TextLinks({ name, link, git, stretched }) {
  // Every card has the same link text, so the project name tells them apart.
  const which = <span className="sr-only">: {name}</span>;
  if (!link && !git) {
    return <div className="type-small text-fg-muted">Private project</div>;
  }
  if (stretched) {
    // The title link already covers the card, so the primary action is a
    // visual cue only. A second destination stays clickable above the overlay.
    return (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-0">
        <span
          aria-hidden="true"
          className="inline-flex min-h-[44px] items-center gap-1 type-small text-fg transition-colors duration-150 group-hover:text-accent-strong"
        >
          {link ? "View project" : "Source code"}
          <span
            className={`inline-block motion-safe:transition-transform duration-150 ${EASE_OUT} motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5`}
          >
            ↗
          </span>
        </span>
        {link && git && (
          <TextLink href={git} className="relative z-10">
            Source code
            {which}
          </TextLink>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-0">
      {link && (
        <TextLink href={link}>
          View project
          {which}
        </TextLink>
      )}
      {git && (
        <TextLink href={git}>
          Source code
          {which}
        </TextLink>
      )}
    </div>
  );
}

export default function OriginalCard({ p, title, hover }) {
  return (
    <article
      className={`group relative w-full overflow-hidden rounded-lg bg-surface shadow-1 ${hoverClass(hover)}`}
    >
      <div className="relative aspect-[605/422] w-full overflow-hidden bg-placeholder">
        {/* Decorative: the heading already names the project. */}
        <Image
          alt=""
          src={p.image}
          fill
          sizes={SIZES}
          className={`object-cover ${hover === "zoom" ? ZOOM : ""}`}
          preload={p.preload}
        />
      </div>

      <div className="flex flex-col gap-4 p-5 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-accent px-3 py-1 text-[12px] text-on-accent lg:text-[13px]">
            {p.category}
          </div>
          <div className="type-small text-fg-muted">{p.date}</div>
        </div>

        <div className="flex flex-col gap-2">
          {title}
          <p className="type-body text-fg-muted">{p.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {p.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-line-strong px-3 py-1 text-[12px] text-fg lg:text-[13px]"
            >
              {tool}
            </span>
          ))}
        </div>

        <TextLinks name={p.name} link={p.link} git={p.git} stretched={p.stretched} />
      </div>
    </article>
  );
}
