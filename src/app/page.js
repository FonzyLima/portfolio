"use client";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Project from "../../components/Project";
import Button from "../../components/Button";
import SlidingText from "../../components/SlidingText";
import Reveal from "../../components/Reveal";
import DarkContext from "@/app/context/darkContext";
import { profile, projects } from "@/app/data/portfolioData";
import { useContext } from "react";
import React from "react";
export default function Home() {
  const [isDark] = useContext(DarkContext);
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 4);
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <Navigation page="home" />
      <div className="gradient-green w-full absolute h-[260px] lg:h-[800px] top-[390px] lg:top-[430px] z-10"></div>

      <div className="z-20 relative mt-[60px]">
        {/* Introduction Start*/}
        <Reveal>
          <div className="flex flex-col gap-[15px] lg:gap-[30px] text-left pt-[60px] px-6 items-left lg:text-center lg:items-center">
            <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px]">
              Hi there! &#128075; I am
            </div>
            <div className="font-semibold text-primary dark:text-secondary text-[30px] lg:text-[90px] flex flex-col">
              <div className="lg:h-[95px] lg:mt-[-45px]">{profile.name}</div>
              <div className="lg:h-[95px]">{profile.title}</div>
            </div>
            <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px]">
              Currently based in {profile.location}
            </div>
            <div onClick={scrollToBottom} className="w-[150px] lg:w-[190px]">
              <Button title="Get in touch" />
            </div>
          </div>
          <div className="hidden lg:flex flex-row justify-center mt-[80px]">
            <Image src="/gameboy.svg" alt="Gameboy" width={960} height={510} />
          </div>
          <div className="lg:hidden flex flex-row justify-center mt-10">
            <Image src="/gameboy.svg" alt="Gameboy" width={330} height={210} />
          </div>
        </Reveal>

        <div className="flex flex-col px-6 text-left items-left lg:items-center mt-[100px] lg:mt-[200px]">
          <div className="lg:w-[775px] flex flex-col gap-[40px] lg:ml-[-90px]">
            <Reveal>
              <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[70px] font-semibold">
                Who I am
              </div>
            </Reveal>
            <Reveal>
              <div className="text-fiftary dark:text-tertiary leading-[147.5%] text-left text-[22px] lg:text-[40px] max-w-[475px] lg:max-w-[775px]">
                {profile.intro}
                <br />
                <br />
                {profile.education}
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal>
          <div className="flex flex-col text-left items-center mt-[100px] lg:mt-[200px] gap-[15px] lg:gap-[30px]">
            <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[70px] font-semibold">
              Portfolio
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-12 mt-12 mb-6">
              {featuredProjects.map((project) => (
                <Project key={project.name} {...project} />
              ))}
            </div>

            <Button title="More Projects" destination="/portfolio" />
          </div>
        </Reveal>

        <div className="mt-40">
          <SlidingText
            text={profile.skillsPrimary}
            direction={-1}
          />
          <div className="mt-[-45px]">
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
