import React from "react";
import Image from "next/image";
import Navigation from "../../../components/Navigation";
import SlidingText from "../../../components/SlidingText";
import Reveal from "../../../components/Reveal";
import { experiences, profile } from "@/app/data/portfolioData";
export default function About() {
  return (
    <div className="">
      <Navigation page="abouts" />
      <Reveal>
        <div className="flex flex-col text-left px-6 lg:px-12 xl:px-24 font-custom">
          <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[56px] xl:text-[70px] font-semibold mt-20">
            More About Me
          </div>
          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="flex w-full max-w-[680px] flex-col gap-10 lg:w-[70%] lg:max-w-none">
              <div className="text-left text-[22px] text-fiftary dark:text-tertiary lg:text-[32px] xl:text-[40px]">
                {profile.summary}
              </div>
              <div className="text-left text-[22px] text-fiftary dark:text-tertiary lg:text-[32px] xl:text-[40px]">
                {profile.intro} {profile.education}
              </div>
            </div>
            <div className="flex w-full justify-center lg:w-[30%] lg:justify-center">
              <div className="relative h-[240px] w-[240px] shrink-0 overflow-hidden rounded-full border border-[#171717] bg-[#d8d8d8] shadow-proj dark:border-[#EBEBEB] dark:bg-[#202020] lg:h-[300px] lg:w-[300px] xl:h-[380px] xl:w-[380px]">
                <Image
                  src="/about-profile.jpg"
                  alt="Alfonso Lima"
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 1024px) 300px, 240px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="mt-28 xl:mt-32">
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
      </Reveal>

      {/* Resume Start */}
      <Reveal>
        <div className="flex flex-col px-6 lg:px-12 xl:px-24 mt-28 xl:mt-32 gap-y-[72px] xl:gap-y-[90px]">
          {experiences.map((experience) => (
            <div
              key={`${experience.company}-${experience.period}`}
              className="grid grid-cols-1 gap-y-6 lg:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.6fr)] lg:gap-x-12 xl:grid-cols-[minmax(260px,1fr)_minmax(0,1.6fr)]"
            >
              <div className="flex flex-col gap-y-[10px] py-[10px]">
                <div className="text-primary dark:text-secondary text-[26px] lg:text-[40px] xl:text-[50px] font-custom font-semibold">
                  {experience.company}
                </div>
                <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[20px] xl:text-[22px] font-custom font-normal">
                  {experience.period}
                </div>
                <div className="text-fiftary dark:text-tertiary text-[16px] xl:text-[18px] font-custom font-normal">
                  {experience.location}
                </div>
              </div>
              <div className="flex min-w-0 flex-col gap-y-[10px]">
                <div className="text-sixtary dark:text-fourtary text-[22px] lg:text-[26px] xl:text-[30px] font-custom font-normal">
                  {experience.role}
                </div>
                <ul className="text-fiftary dark:text-tertiary text-[18px] lg:text-[20px] xl:text-[22px] w-full max-w-[730px] font-custom font-normal list-disc pl-5 space-y-3">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
