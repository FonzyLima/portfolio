"use client";
import React from "react";
import { FiArrowUp } from "react-icons/fi";
import { scrollToAnchor } from "@/app/lib/scrollToAnchor";

// Smooth-scrolls to <main> and moves focus there (it has tabIndex -1), so
// keyboard users land back at the start of the content, not the skip link.
export default function BackToTop({ className = "" }) {
  return (
    <a
      href="#main"
      onClick={(event) => scrollToAnchor(event, "#main")}
      className={`group inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 type-small text-fg hover:text-fg-muted transition-colors duration-150 ${className}`}
    >
      Back to top
      <FiArrowUp
        aria-hidden="true"
        className="h-4 w-4 motion-safe:transition-transform duration-150 motion-safe:group-hover:-translate-y-0.5"
      />
    </a>
  );
}
