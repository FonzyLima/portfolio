"use client";

import React, { useState, useSyncExternalStore } from "react";
import Project from "./Project";
import UnderlineFilter from "./UnderlineFilter";

const filterOptions = [
  {
    id: "all",
    label: "All",
    noun: ["project", "projects"],
    matches: () => true,
  },
  {
    id: "websites",
    label: "Websites",
    noun: ["website", "websites"],
    matches: (project) => project.category === "Website",
  },
  {
    id: "mobile-apps",
    label: "Mobile apps",
    shortLabel: "Mobile",
    noun: ["mobile app", "mobile apps"],
    matches: (project) => project.category === "Mobile App",
  },
  {
    id: "others",
    label: "Other",
    noun: ["game, bot or experiment", "games, bots and experiments"],
    matches: (project) => !["Website", "Mobile App"].includes(project.category),
  },
];

// The active filter lives in ?filter= so a filtered view can be shared and
// survives a reload. The URL is the source of truth; the page is statically
// rendered, so the server (and hydration) always use "all".
const PARAM = "filter";
const CHANGE_EVENT = "portfolio-filter-change";

function filterFromUrl() {
  const id = new URLSearchParams(window.location.search).get(PARAM);
  return filterOptions.some((filter) => filter.id === id) ? id : "all";
}

function subscribe(onChange) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function writeFilterToUrl(id) {
  const url = new URL(window.location.href);
  if (id === "all") url.searchParams.delete(PARAM);
  else url.searchParams.set(PARAM, id);
  window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Filter chips + project grid for /projects. `projects` is fetched on the
// server (src/app/projects/page.js), so the grid is in the initial HTML.
export default function PortfolioFilters({ projects }) {
  const activeFilter = useSyncExternalStore(subscribe, filterFromUrl, () => "all");
  // Only animate the grid on a chip click; the first paint already gets the
  // page's <Reveal>.
  const [animate, setAnimate] = useState(false);

  const selectFilter = (id) => {
    setAnimate(true);
    writeFilterToUrl(id);
  };

  // Hide categories with nothing in them (Sanity content can change).
  const visibleFilters = filterOptions.filter(
    (filter) => filter.id === "all" || projects.some(filter.matches),
  );
  const selectedFilter =
    visibleFilters.find((filter) => filter.id === activeFilter) ?? visibleFilters[0];
  const filteredProjects = projects.filter(selectedFilter.matches);
  const count = filteredProjects.length;

  // An odd count in the two-up grid leaves the last card alone on its row, so
  // the first card goes wide instead.
  const featureFirst = count % 2 === 1;

  return (
    <>
      <div className="mt-8 lg:mt-10">
        <UnderlineFilter
          label="Project filters"
          value={selectedFilter.id}
          onChange={selectFilter}
          options={visibleFilters.map((filter) => ({
            id: filter.id,
            label: filter.label,
            shortLabel: filter.shortLabel,
            count: projects.filter(filter.matches).length,
          }))}
        />
      </div>

      {/* Screen readers hear the result of a filter change. */}
      <p className="sr-only" aria-live="polite">
        Showing {count} {selectedFilter.noun[count === 1 ? 0 : 1]}
      </p>

      {/* Keyed on the filter so the new set eases in instead of snapping. */}
      <div
        key={selectedFilter.id}
        className={`${animate ? "reveal-immediate" : ""} mt-8 lg:mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8`}
      >
        {filteredProjects.map((project, index) => (
          <Project
            key={project._id ?? project.name}
            {...project}
            wide={featureFirst && index === 0}
            headingLevel="h2"
            // The first row can be the LCP element, so fetch it from <head>.
            preload={selectedFilter.id === "all" && index < 2}
          />
        ))}
      </div>
    </>
  );
}
