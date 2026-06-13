import React from "react";
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
          <div className="text-fiftary dark:text-tertiary text-left text-[22px] lg:text-[40px] max-w-[348px] lg:max-w-[1028px] mt-10">
            {profile.summary}
          </div>
          <div className="text-fiftary dark:text-tertiary text-left text-[22px] lg:text-[40px] max-w-[348px] lg:max-w-[1028px] mt-10">
            {profile.intro} {profile.education}
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
