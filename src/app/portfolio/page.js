import React from "react";
import Project from "../../../components/Project";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";

export default function projects() {
  return (
    <div className="">
      <Navigation page="portfolio" />
      <div className="flex flex-col text-left items-center font-custom">
        <div className="text-secondary text-left text-[36px] lg:text-[70px] font-semibold mt-20">
          Portfolio
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12">
          <Project name="Bok Fried Chicken" date="December 2021" image="/bok.png"/>
          <Project name="925 Wear" date="October 2023" image="/925.png"/>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12">
          <Project name="Mutya (2D Game)" date="December 2022" image="/mutya.png"/>
          <Project name="Blitz (Wordle Discord Bot)" date="March 2022" image="/blitz.png"/>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center space-x-0 lg:space-x-6 space-y-12 lg:space-y-0 mt-12 w-1/2">
          <Project name="Serbiz Landing Page" date="December 2022" image="/serbiz.png"/>

        </div>
      </div>
      
    </div>
  );
}
