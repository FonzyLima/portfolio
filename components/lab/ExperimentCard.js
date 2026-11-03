import React from "react";
import Link from "next/link";
import { DEMOS } from "./demos";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2026-11" -> "Nov 2026". Fixed English names, so server and client agree.
const formatMonth = (value) => {
  const [year, month] = value.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
};

// Lab card. Same shell, spacing, meta, tag and link styles as the project card
// (components/Project.js), with a demo stage in place of the thumbnail.
export default function ExperimentCard({
  title,
  description,
  date,
  tags = [],
  demo,
  link,
  headingLevel = "h2",
}) {
  const Heading = headingLevel;
  const Demo = demo ? DEMOS[demo] : null;

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-lg bg-surface shadow-1">
      {Demo && (
        // Same aspect ratio as project thumbnails, so demos never shift layout.
        <div className="relative flex aspect-[605/422] w-full items-center justify-center overflow-hidden bg-page p-6">
          <Demo />
        </div>
      )}

      <div className="flex flex-col gap-4 p-5 lg:p-6">
        {date && (
          <time dateTime={date} className="type-small text-fg-muted">
            {formatMonth(date)}
          </time>
        )}

        <div className="flex flex-col gap-2">
          <Heading className="type-h3 text-fg">{title}</Heading>
          <p className="type-body max-w-[65ch] text-fg-muted">{description}</p>
        </div>

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line-strong px-3 py-1 text-[12px] text-fg lg:text-[13px]"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {link && (
          <div className="flex flex-wrap gap-x-6 gap-y-0">
            <Link
              href={link.href}
              className="inline-flex min-h-[44px] items-center type-small underline text-fg hover:text-accent-strong transition-colors duration-200"
            >
              {link.label}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
