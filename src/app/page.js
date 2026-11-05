import Project from "../../components/Project";
import Button from "../../components/Button";
import ScrollToButton from "../../components/ScrollToButton";
import SlidingText from "../../components/SlidingText";
import Reveal from "../../components/Reveal";
import GameboyHero from "../../components/gameboy/GameboyHero";
import HomeAbout from "../../components/HomeAbout";
import { profile } from "@/app/data/portfolioData";
import { getProjects } from "@/sanity/lib/projects";
import React from "react";

// Rebuild the page (and re-query Sanity) at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const { projects } = await getProjects();
  // Fall back to the first projects if none are marked featured (e.g. a fresh
  // Sanity dataset where `featured` defaults to false), so the grid is never empty.
  const marked = projects.filter((project) => project.featured);
  const featuredProjects = (marked.length > 0 ? marked : projects).slice(0, 4);

  return (
    <div>
      <div className="gradient-green w-full absolute h-[240px] sm:h-[350px] lg:h-[480px] xl:h-[540px] top-[358px] sm:top-[300px] lg:top-[368px] xl:top-[377px] z-10"></div>

      <div className="z-20 relative pt-24 lg:pt-32">
        {/* Introduction Start*/}
        {/* Staggered CSS entrance: each line rises from first paint, 60ms apart.
            The Gameboy's screen intro assumes its wrapper starts at ~240ms. */}
        <div className="flex flex-col gap-4 lg:gap-5 text-left px-6 lg:text-center lg:items-center">
          <Reveal immediate className="type-body text-fg-muted">
            Hi there! <span aria-hidden="true">&#128075;</span> I’m
          </Reveal>
          <div className="flex max-w-[1120px] flex-col text-fg">
            <Reveal immediate delay={60}>
              <h1 className="type-display">{profile.name}</h1>
            </Reveal>
            <Reveal immediate delay={120}>
              <p className="type-display text-accent-strong [text-wrap:balance]">
                {profile.title}
              </p>
            </Reveal>
          </div>
          <Reveal immediate delay={180} className="flex flex-col gap-4 lg:gap-5 lg:items-center">
            <div className="type-body text-fg-muted">
              Based in {profile.location}
            </div>
            <div className="self-start lg:self-center">
              <ScrollToButton title="Get in touch" target="#footer" />
            </div>
          </Reveal>
        </div>
        <Reveal immediate delay={240} className="mt-10 lg:mt-14 flex justify-center px-6 lg:px-8">
          <GameboyHero className="w-full max-w-[300px] sm:max-w-[440px] lg:max-w-[600px] xl:max-w-[680px]" />
        </Reveal>

        <HomeAbout />
        <Reveal>
          <div className="page-container section-gap flex flex-col gap-6 lg:gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="type-h2 text-left text-fg">
                Featured projects
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
              {featuredProjects.map((project) => (
                // Featured cards sit below the fold, so they aren't preloaded:
                // preloading them competed with the CSS and the hero for bandwidth.
                <Project key={project._id ?? project.name} {...project} />
              ))}
            </div>

            <div className="self-center">
              <Button title="View all projects" destination="/projects" icon="next" />
            </div>
          </div>
        </Reveal>

        <div className="section-gap">
          <SlidingText
            text={profile.skillsPrimary}
            direction={-1}
          />
          <SlidingText
            text={profile.skillsSecondary}
            direction={1}
          />
        </div>
      </div>
    </div>
  );
}
