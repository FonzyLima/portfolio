"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Project from "../../components/Project";
import Button from "../../components/Button";
import SlidingText from "../../components/SlidingText";
export default function Home() {
  return (
    <div>
      <Navigation page="home" />
      <div className="gradient-green w-full absolute h-[260px] lg:h-[800px] top-[390px] lg:top-[430px] z-10"></div>
      <div className="z-20 relative mt-[60px]">
        {/* Introduction Start*/}
        <div className="flex flex-col gap-[15px] lg:gap-[30px] text-left pt-[60px] px-6 items-left lg:text-center lg:items-center">
          <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px]">
            Hi there! &#128075; I am
          </div>
          <div className="font-semibold text-primary dark:text-secondary text-[30px] lg:text-[90px] flex flex-col">
            <div className="lg:h-[95px] lg:mt-[-45px]">Alfonso Lima</div>
            <div className="lg:h-[95px]">Software Developer</div>
          </div>
          <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px]">
            Currently based in Manila, Philippines
          </div>
          <div className="w-[150px] lg:w-[190px]">
            <Button title="Get in touch" />
          </div>
        </div>
        <div className="hidden lg:flex flex-row justify-center mt-[80px]">
          <Image src="/gameboy.svg" alt="Gameboy" width={960} height={510} />
        </div>
        <div className="lg:hidden flex flex-row justify-center mt-10">
          <Image src="/gameboy.svg" alt="Gameboy" width={330} height={210} />
        </div>

        <div className="flex flex-col px-6 text-left items-left lg:items-center mt-[100px] lg:mt-[200px]">
          <div className="lg:w-[775px] flex flex-col gap-[40px] lg:ml-[-90px]">
            <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[70px] font-semibold">
              Who I am
            </div>
            <div className="text-fiftary dark:text-tertiary leading-[147.5%] text-left text-[22px] lg:text-[40px] max-w-[475px] lg:max-w-[775px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. <br />
              <br />
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </div>
          </div>
        </div>

        <div className="flex flex-col text-left items-center mt-[100px] lg:mt-[200px] gap-[15px] lg:gap-[30px]">
          <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[70px] font-semibold">
            Portfolio
          </div>
          <div className="flex flex-col justify-center items-center lg:flex-row space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12">
            <Project
              name="925 Wear"
              date="October 2023"
              image="/925.png"
              link="https://925studio.online"
              words={["Website", "NextJS", "Tailwind", "Freelance"]}
            />
            <Project
              name="Mutya (2D Game)"
              date="December 2022"
              image="/mutya.png"
              link="https://alfygl.itch.io/mutya"
              git="https://github.com/FonzyLima/mutya"
              words={["Game", "Unity", "C#", "Project"]}
            />
          </div>
          <div className="flex flex-col justify-center items-center  lg:flex-row space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12 mb-6">
            <Project
              name="Blitz (Wordle Discord Bot)"
              date="March 2022"
              image="/blitz.png"
              git="https://github.com/FonzyLima/blitz-bot"
              words={["Bot", "Python", "Discord.py", "Project"]}
            />
            <Project
              name="Bok Fried Chicken"
              date="December 2021"
              image="/bok.png"
              link="https://bokfriedchicken.com"
              words={["Website", "NextJS", "CSS", "Freelance"]}
            />
          </div>

          <Button title="More Projects" destination="/portfolio" />
        </div>
        <div className="mt-40">
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
      </div>
    </div>
  );
}
