import React from "react";
import Project from "../../../components/Project";
import Navigation from "../../../components/Navigation";
import Reveal from "../../../components/Reveal";
import Link from "next/link";
import { projects } from "@/app/data/portfolioData";
export default function Projects() {
  return (
    <div className="">
      <Navigation page="portfolio" />
      <Reveal>
        <div className="flex flex-col text-left items-center font-custom pb-[18px]">
          <div className="text-primary dark:text-secondary text-center text-[36px] lg:text-[70px] font-semibold mt-20">
            Portfolio
          </div>
          <div className="text-primary dark:text-secondary text-[22px] lg:text-[40px] font-semibold text-center">
            More projects can be found on my{" "}
            <Link href="https://github.com/FonzyLima" target="_blank">
              <span className="underline">Github</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-12 mt-12 mb-6">
            {projects.map((project) => (
              <Project key={project.name} {...project} />
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
