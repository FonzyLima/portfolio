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
          Lorem Ipsum dolor sit
        </div>
        <div className="text-fiftary dark:text-tertiary text-left text-[22px] lg:text-[40px] max-w-[348px] lg:max-w-[1028px] mt-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
        <div className="text-fiftary dark:text-tertiary text-left text-[22px] lg:text-[40px] max-w-[348px] lg:max-w-[1028px] mt-10">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>
        </div>
        
      </div>
      </Reveal>
      
   
    </div>
  );
}
