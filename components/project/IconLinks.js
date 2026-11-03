import React from "react";
import Link from "next/link";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { PrivateNote, primaryAction } from "./shared";

// The "Icons" actions style, only reachable from /lab/cards. Project.js loads
// it with next/dynamic so public pages don't ship it.
//
// The reference's compact icon buttons, with a tooltip naming each one on
// hover and keyboard focus so they aren't guesswork.
const ICON_BUTTON =
  "group/btn relative inline-flex h-11 w-11 items-center justify-center rounded-full text-fg-muted transition-colors duration-150";

function Tooltip({ children }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-fg px-2 py-1 text-[12px] text-page opacity-0 transition-opacity duration-150 group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 lg:text-[13px]"
    >
      {children}
    </span>
  );
}

export default function IconLinks({ p }) {
  if (!p.link && !p.git) return <PrivateNote />;

  const action = primaryAction(p.category, p.link);
  const cue = (icon, tip) => (
    <span aria-hidden="true" className={`${ICON_BUTTON} group-hover:text-accent-strong`}>
      {icon}
      <Tooltip>{tip}</Tooltip>
    </span>
  );
  const button = (href, label, icon) => (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}: ${p.name} (opens in a new tab)`}
      className={`${ICON_BUTTON} z-10 hover:text-fg`}
    >
      {icon}
      <Tooltip>{label}</Tooltip>
    </Link>
  );

  const gitIcon = <FiGithub aria-hidden="true" className="h-[22px] w-[22px]" />;
  const linkIcon = <FiExternalLink aria-hidden="true" className="h-[22px] w-[22px]" />;
  const gitIsPrimary = p.stretched && !p.link;

  return (
    <div className="-mr-2.5 flex shrink-0">
      {p.git &&
        (gitIsPrimary ? cue(gitIcon, "View code") : button(p.git, "View code", gitIcon))}
      {p.link &&
        (p.stretched ? cue(linkIcon, action.label) : button(p.link, action.label, linkIcon))}
    </div>
  );
}
