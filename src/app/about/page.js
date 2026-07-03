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
        <div className="flex flex-col text-left px-6 lg:px-24 font-custom">
          <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[70px] font-semibold mt-20">
            More About Me
          </div>
          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="flex max-w-[348px] flex-col gap-10 lg:w-[70%] lg:max-w-none">
              <div className="text-left text-[22px] text-fiftary dark:text-tertiary lg:text-[40px]">
                {profile.summary}
              </div>
              <div className="text-left text-[22px] text-fiftary dark:text-tertiary lg:text-[40px]">
                {profile.intro} {profile.education}
              </div>
            </div>
            <div className="flex w-full justify-center lg:w-[30%] lg:justify-center">
              <div className="relative h-[240px] w-[240px] shrink-0 overflow-hidden rounded-full border border-[#171717] bg-[#d8d8d8] shadow-proj dark:border-[#EBEBEB] dark:bg-[#202020] lg:h-[380px] lg:w-[380px]">
                <Image
                  src="/about-profile.jpg"
                  alt="Alfonso Lima"
                  fill
                  sizes="(min-width: 1024px) 380px, 240px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="mt-32">
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
      </Reveal>

      {/* Resume Start */}
      <Reveal>
        <div className="flex flex-col px-6 lg:px-24 mt-32 gap-y-[90px]">
          {experiences.map((experience) => (
            <div
              key={`${experience.company}-${experience.period}`}
              className="flex flex-col lg:flex-row justify-between gap-y-6"
            >
              <div className="flex flex-col gap-y-[10px] py-[10px]">
                <div className="text-primary dark:text-secondary text-[26px] lg:text-[50px] font-custom font-semibold">
                  {experience.company}
                </div>
                <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px] font-custom font-normal">
                  {experience.period}
                </div>
                <div className="text-fiftary dark:text-tertiary text-[16px] lg:text-[18px] font-custom font-normal">
                  {experience.location}
                </div>
              </div>
              <div className="flex flex-col gap-y-[10px]">
                <div className="text-sixtary dark:text-fourtary text-[22px] lg:text-[30px] font-custom font-normal">
                  {experience.role}
                </div>
                <ul className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px] w-[320px] lg:w-[730px] font-custom font-normal list-disc pl-5 space-y-3">
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
