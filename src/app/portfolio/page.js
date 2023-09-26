import React from "react";
import Project from "../../../components/Project";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";

export default function projects() {
  return (
    <div className="">
      <Navigation page="portfolio" />
      <div className="flex flex-col text-left items-center font-custom">
        <div className="text-secondary text-left text-[70px] font-semibold mt-20">
          Portfolio
        </div>
        <div className="flex flex-row space-x-6 mt-12">
          <Project name="Bok Fried Chicken" date="December 2021" />
          <Project name="Bok Fried Chicken" date="December 2022" />
        </div>
        <div className="flex flex-row space-x-6 mt-12">
          <Project name="Bok Fried Chicken" date="December 2021" />
          <Project name="Bok Fried Chicken" date="December 2022" />
        </div>
      </div>
      
    </div>
  );
}
