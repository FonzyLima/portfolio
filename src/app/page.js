"use client";
import Image from "next/image";
import { Inter, Reenie_Beanie } from "next/font/google";
import styles from "./page.module.css";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Project from "../../components/Project";
import Button from "../../components/Button";
import SlidingText from "../../components/SlidingText";
import Reveal from "../../components/Reveal";
import DarkContext from "@/app/context/darkContext";
import { useContext } from "react";
import React from "react";
export default function Home() {
  const [isDark, setisDark] = useContext(DarkContext);
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
              <div className="lg:h-[95px] lg:mt-[-45px]">Alfonso Lima</div>
              <div className="lg:h-[95px]">Full Stack Software Developer</div>
            </div>
            <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px]">
              Currently based in Manila, Philippines
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
                I am a Software Engineer who specializes in Web and
                Mobile Development using React and React Native<br />
                <br />I graduated with honors in Computer Science with
                a minor in Social Technopreneurship in De La Salle University -
                Manila
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal>
          <div className="flex flex-col text-left items-center mt-[100px] lg:mt-[200px] gap-[15px] lg:gap-[30px]">
            <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[70px] font-semibold">
              Portfolio
            </div>
            <div className="flex flex-col justify-center items-center lg:flex-row space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12">
              <Project
                name="Queue Up"
                date="August 2025"
                image="/qup.png"
                git="https://github.com/FonzyLima/blitz-bot"
                words={["App", "React Native", "NodeJS", "Startup"]}
              />
              <Project
                name="925 Wear"
                date="October 2023"
                image="/925.png"
                link="https://925studio.online"
                words={["Website", "NextJS", "Tailwind", "Freelance"]}
              />
            </div>
            <div className="flex flex-col justify-center items-center  lg:flex-row space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12 mb-6">
              <Project
                name="Mutya (2D Game)"
                date="December 2022"
                image="/mutya.png"
                link="https://alfygl.itch.io/mutya"
                git="https://github.com/FonzyLima/mutya"
                words={["Game", "Unity", "C#", "Project"]}
              />
              <Project
                name="Blitz (Wordle Discord Bot)"
                date="March 2022"
                image="/blitz.png"
                git="https://github.com/FonzyLima/blitz-bot"
                words={["Bot", "Python", "Discord.py", "Project"]}
              />
            </div>

            <Button title="More Projects" destination="/portfolio" />
          </div>
        </Reveal>

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
