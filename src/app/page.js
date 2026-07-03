"use client";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Project, { ProjectSkeleton } from "../../components/Project";
import Button from "../../components/Button";
import SlidingText from "../../components/SlidingText";
import Reveal from "../../components/Reveal";
import DarkContext from "@/app/context/darkContext";
import { profile } from "@/app/data/portfolioData";
import { useProjects } from "@/app/hooks/useProjects";
import { useContext } from "react";
import React from "react";
export default function Home() {
  const [isDark] = useContext(DarkContext);
  const { projects: featuredProjects, isLoading: isLoadingProjects } = useProjects({
    featuredOnly: true,
    limit: 4,
  });
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <Navigation page="home" />
      <div className="gradient-green w-full absolute h-[260px] lg:h-[520px] xl:h-[800px] top-[390px] lg:top-[420px] xl:top-[430px] z-10"></div>

      <div className="z-20 relative mt-[60px]">
        {/* Introduction Start*/}
        <Reveal>
          <div className="flex flex-col gap-[15px] lg:gap-[24px] xl:gap-[30px] text-left pt-[60px] px-6 items-left lg:text-center lg:items-center">
            <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[20px] xl:text-[22px]">
              Hi there! &#128075; I am
            </div>
            <div className="flex max-w-[1120px] flex-col font-semibold leading-[1.05] text-primary dark:text-secondary text-[34px] sm:text-[48px] lg:text-[72px] xl:text-[90px]">
              <div>{profile.name}</div>
              <div>{profile.title}</div>
            </div>
            <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[20px] xl:text-[22px]">
              Currently based in {profile.location}
            </div>
            <div onClick={scrollToBottom} className="w-[150px] lg:w-[180px] xl:w-[190px]">
              <Button title="Get in touch" />
            </div>
          </div>
          <div className="hidden lg:flex flex-row justify-center mt-[70px] xl:mt-[80px] px-8">
            <Image src="/gameboy.svg" alt="Gameboy" width={960} height={510} className="h-auto w-full max-w-[860px] xl:max-w-[960px]" />
          </div>
          <div className="lg:hidden flex flex-row justify-center mt-10">
            <Image src="/gameboy.svg" alt="Gameboy" width={330} height={210} />
          </div>
        </Reveal>

        <div className="flex flex-col px-6 text-left items-left lg:items-center mt-[100px] lg:mt-[160px] xl:mt-[200px]">
          <div className="flex w-full max-w-[775px] flex-col gap-[40px] lg:ml-[-60px] xl:ml-[-90px]">
            <Reveal>
              <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[56px] xl:text-[70px] font-semibold">
                Who I am
              </div>
            </Reveal>
            <Reveal>
              <div className="text-fiftary dark:text-tertiary leading-[147.5%] text-left text-[22px] md:max-w-[640px] lg:text-[32px] lg:max-w-[775px] xl:text-[40px]">
                {profile.intro}
                <br />
                <br />
                {profile.education}
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal>
          <div className="mx-auto mt-[100px] flex w-full max-w-[1160px] flex-col gap-[30px] px-6 lg:mt-[160px] lg:px-10 xl:mt-[200px]">
            <div className="flex flex-col gap-4">
              <div className="text-left text-[36px] font-semibold text-primary dark:text-secondary lg:text-[56px] xl:text-[70px]">
                Featured projects
              </div>
            </div>

            <div className="grid grid-cols-1 justify-items-center gap-8 lg:grid-cols-2">
              {isLoadingProjects
                ? Array.from({ length: 4 }, (_, index) => (
                    <ProjectSkeleton key={`featured-project-skeleton-${index}`} />
                  ))
                : featuredProjects.map((project) => (
                    <Project key={project.name} {...project} />
                  ))}
            </div>

            <div className="w-[170px] lg:w-[200px] xl:w-[220px] self-center">
              <Button title="More Projects" destination="/portfolio" />
            </div>
          </div>
        </Reveal>

        <div className="mt-32 xl:mt-40">
          <SlidingText
            text={profile.skillsPrimary}
            direction={-1}
          />
          <div className="mt-[-30px] xl:mt-[-45px]">
            <SlidingText
              text={profile.skillsSecondary}
              direction={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
