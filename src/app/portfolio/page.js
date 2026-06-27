"use client";

import React, { useState } from "react";
import Project from "../../../components/Project";
import Navigation from "../../../components/Navigation";
import Reveal from "../../../components/Reveal";
import Link from "next/link";
import { projects } from "@/app/data/portfolioData";

const filterOptions = [
  {
    id: "all",
    label: "All",
    description: "Selected projects",
    matches: () => true,
  },
  {
    id: "websites",
    label: "Websites",
    description: "Next.js, React, responsive interfaces",
    matches: (project) => project.category === "Website",
  },
  {
    id: "mobile-apps",
    label: "Mobile Apps",
    description: "React Native and app workflows",
    matches: (project) => project.category === "Mobile App",
  },
  {
    id: "others",
    label: "Others",
    description: "Games, bots, and experiments",
    matches: (project) => !["Website", "Mobile App"].includes(project.category),
  },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const selectedFilter =
    filterOptions.find((filter) => filter.id === activeFilter) ?? filterOptions[0];
  const filteredProjects = projects.filter(selectedFilter.matches);

  return (
    <div className="">
      <Navigation page="portfolio" />
      <Reveal>
        <section className="mx-auto flex w-full max-w-[1160px] flex-col px-6 pb-[18px] pt-20 font-custom lg:px-10">
          <div className="flex flex-col gap-5">
            <div className="text-[36px] font-semibold text-primary dark:text-secondary lg:text-[70px]">
              Portfolio
            </div>
            <div className="max-w-[900px] text-[22px] font-normal leading-[147.5%] text-fiftary dark:text-tertiary lg:text-[40px]">
              A collection of games, websites, mobile apps, and product experiments built across the full stack.
            </div>
            <div className="text-[18px] text-fiftary dark:text-tertiary lg:text-[22px]">
              More work can be found on my{" "}
              <Link
                href="https://github.com/FonzyLima"
                target="_blank"
                className="underline text-primary hover:text-sixtary dark:text-secondary dark:hover:text-fourtary"
              >
                GitHub
              </Link>
              .
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-3" aria-label="Project filters">
            {filterOptions.map((filter) => {
              const isActive = filter.id === activeFilter;
              const count = projects.filter(filter.matches).length;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] duration-200 lg:text-[18px] ${
                    isActive
                      ? "border-[#61BC7A] bg-[#61BC7A] text-secondary dark:border-[#7DF39D] dark:bg-[#7DF39D] dark:text-primary"
                      : "border-[#171717] text-primary hover:border-[#61BC7A] hover:text-sixtary dark:border-[#EBEBEB] dark:text-secondary dark:hover:border-[#7DF39D] dark:hover:text-fourtary"
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="font-normal">{filter.label}</span>
                  <span
                    className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[12px] lg:text-[14px] ${
                      isActive
                        ? "bg-secondary text-primary dark:bg-primary dark:text-secondary"
                        : "bg-[#d8d8d8] text-primary dark:bg-[#202020] dark:text-secondary"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-12 grid grid-cols-1 justify-items-center gap-8 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <Project key={project.name} {...project} />
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
