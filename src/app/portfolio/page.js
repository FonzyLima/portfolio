import React from "react";
import Project from "../../../components/Project";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import Reveal from "../../../components/Reveal";
import Link from "next/link";
export default function projects() {
  return (
    <div className="">
      <Navigation page="portfolio" />
      <Reveal>
        <div className="flex flex-col text-left items-center font-custom pb-[18px]">
          <div className="text-primary dark:text-secondary text-center text-[36px] lg:text-[70px] font-semibold mt-20">
            Portfolio
          </div>
          <div className="text-primary dark:text-secondary text-[22px] lg:text-[40px] font-semibold text-center">
            More projects can be found on my{" "}
            <Link href="https://github.com/FonzyLima" target="_blank">
              <span className="underline">Github</span>
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center lg:flex-row space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12">
            <Project
              name="Queue Up"
              date="August 2025"
              image="/qup.png"
              git="/"
              link="/"
              words={["App", "React Native", "NodeJS", "Startup"]}
            />
            <Project
              name="Ashure"
              date="June 2025"
              image="/Ashure.png"
              link="https://ashureweb.vercel.app"
              words={["App", "React Native", "AWS", "Startup"]}
            />
          </div>
          <div className="flex flex-col justify-center items-center  lg:flex-row space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12 mb-6">
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
              name="Bok Fried Chicken"
              date="December 2021"
              image="/bok.png"
              link="https://bokfriedchicken.com"
              words={["Website", "NextJS", "CSS", "Freelance"]}
            />
            <Project
              name="Blitz (Wordle Discord Bot)"
              date="March 2022"
              image="/blitz.png"
              git="https://github.com/FonzyLima/blitz-bot"
              words={["Bot", "Python", "Discord.py", "Project"]}
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
