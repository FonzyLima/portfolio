import React from "react";
import Project from "../../../components/Project";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";

export default function projects() {
  return (
    <div className="">
      <Navigation page="portfolio" />
      <div className="flex flex-col text-left items-center font-custom">
        <div className="text-primary dark:text-secondary text-left text-[36px] lg:text-[70px] font-semibold mt-20">
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
        <div className="flex flex-col lg:flex-row justify-center items-center space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12 w-1/2">
          <Project
            name="Serbiz Landing Page"
            date="December 2022"
            image="/serbiz.png"
            link="https://serbiz.com.ph"
            words={["Website", "NextJS", "Tailwind", "Freelance"]}
          />
        </div>
      </div>
    </div>
  );
}
