import React from "react";
import Navigation from "../../../components/Navigation";
import SlidingText from "../../../components/SlidingText";
import Footer from "../../../components/Footer";
import Reveal from "../../../components/Reveal";
export default function about() {
  return (
    <div className="">
      <Navigation page="abouts" />
      <Reveal>
        <div className="flex flex-col text-left px-6 lg:px-24 font-custom">
          <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[70px] font-semibold mt-20">
            More About Me
          </div>
          <div className="text-fiftary dark:text-tertiary text-left text-[22px] lg:text-[40px] max-w-[348px] lg:max-w-[1028px] mt-10">
            I'm a coder driven by the thrill of creation. Building websites and
            software solutions is not just a job for me; it's a passion that
            ignites my creativity. Constantly seeking new challenges, I find joy
            in transforming ideas into tangible digital experiences.
          </div>
          <div className="text-fiftary dark:text-tertiary text-left text-[22px] lg:text-[40px] max-w-[348px] lg:max-w-[1028px] mt-10">
            Beyond coding, I'm an avid learner, especially in tech. Each project
            offers a chance to deepen my understanding and find innovative
            solutions to real-world problems. I'm dedicated to growth, always
            seeking to master new languages and trends, propelled by my
            unwavering passion for coding.
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="mt-32">
          <SlidingText
            text="Backend Frontend Mobile Web Game AI Development&nbsp;"
            direction={-1}
          />
          <div className="mt-[-45px]">
            <SlidingText
              text="ReactJS NextJS NodeJS Python Java C# C++ PHP SQL&nbsp;"
              direction={1}
            />
          </div>
        </div>
      </Reveal>

      {/* Resume Start */}
      <Reveal>
        <div className="flex flex-col px-6 lg:px-24 mt-32 gap-y-[90px]">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex flex-col gap-y-[10px] py-[10px]">
              <div className="text-primary dark:text-secondary text-[26px] lg:text-[50px] font-custom font-semibold">
                WRSHealth
              </div>
              <div className="text-fiftary dark:text-tertiary text-[22px] lg:text-[22px] font-custom font-normal">
                June 2023 - Sept 2023
              </div>
            </div>
            <div className="flex flex-col gap-y-[10px] ">
              <div className="text-sixtary dark:text-fourtary text-[22px] lg:text-[30px] font-custom font-normal">
                Software Engineering Intern
              </div>
              <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px] w-[320px] lg:w-[730px] font-custom font-normal">
                Enhanced functionality and resolved technical issues within the
                company's web application by implementing new features and
                addressing bugs
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex flex-col gap-y-[10px] py-[10px]">
              <div className="text-primary dark:text-secondary text-[26px] lg:text-[50px] font-custom font-semibold">
                xDNA Digital Agency
              </div>
              <div className="text-fiftary dark:text-tertiary text-[22px] lg:text-[22px] font-custom font-normal">
                April 2023 - June 2023
              </div>
            </div>
            <div className="flex flex-col gap-y-[10px] ">
              <div className="text-sixtary dark:text-fourtary text-[22px] lg:text-[30px] font-custom font-normal">
                Web Development Intern
              </div>
              <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px] w-[320px] lg:w-[730px] font-custom font-normal">
                Contributed to the creation of a comprehensive time-in/time-out
                system for the company, leveraging Next.js for efficient and
                streamlined development.
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex flex-col gap-y-[10px] py-[10px]">
              <div className="text-primary dark:text-secondary text-[26px] lg:text-[50px] font-custom font-semibold">
                WTW
              </div>
              <div className="text-fiftary dark:text-tertiary text-[22px] lg:text-[22px] font-custom font-normal">
                April 2022 - October 2023
              </div>
            </div>
            <div className="flex flex-col gap-y-[10px] ">
              <div className="text-sixtary dark:text-fourtary text-[22px] lg:text-[30px] font-custom font-normal">
                DevOps Intern
              </div>
              <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px] w-[320px] lg:w-[730px] font-custom font-normal">
                Led the development process for an application that organizes
                the DevOps process of the teams more efficiently using .NET,
                ReactJS, and Azure technologies.
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="flex flex-col gap-y-[10px] py-[10px]">
              <div className="text-primary dark:text-secondary text-[26px] lg:text-[50px] font-custom font-semibold">
                Meetbit
              </div>
              <div className="text-fiftary dark:text-tertiary text-[22px] lg:text-[22px] font-custom font-normal">
                April 2022 - October 2023
              </div>
            </div>
            <div className="flex flex-col gap-y-[10px] ">
              <div className="text-sixtary dark:text-fourtary text-[22px] lg:text-[30px] font-custom font-normal">
                Web Development Intern
              </div>
              <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px] w-[320px] lg:w-[730px] font-custom font-normal">
                Developed additional features for the company’s software
                products using ReactJS and AWS technologies.
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
