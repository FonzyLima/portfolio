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

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="border-t-[0.5px] border-[#171717] pt-4 dark:border-[#EBEBEB]">
              <div className="text-[30px] font-semibold text-primary dark:text-secondary lg:text-[50px]">
                {projects.length}
              </div>
              <div className="text-[18px] text-fiftary dark:text-tertiary lg:text-[22px]">
                Selected projects
              </div>
            </div>
            <div className="border-t-[0.5px] border-[#171717] pt-4 dark:border-[#EBEBEB]">
              <div className="text-[30px] font-semibold text-primary dark:text-secondary lg:text-[50px]">
                Web
              </div>
              <div className="text-[18px] text-fiftary dark:text-tertiary lg:text-[22px]">
                Next.js, React, responsive interfaces
              </div>
            </div>
            <div className="border-t-[0.5px] border-[#171717] pt-4 dark:border-[#EBEBEB]">
              <div className="text-[30px] font-semibold text-primary dark:text-secondary lg:text-[50px]">
                Apps
              </div>
              <div className="text-[18px] text-fiftary dark:text-tertiary lg:text-[22px]">
                Mobile builds, games, bots, and APIs
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 justify-items-center gap-8 lg:grid-cols-2">
            {projects.map((project) => (
              <Project key={project.name} {...project} />
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
