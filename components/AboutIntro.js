import React from "react";
import TrainerCard from "./TrainerCard";
import TrainerSide from "./TrainerSide";

// About intro: the heading and text (components/TrainerSide.js) beside a
// Pokémon trainer card (components/TrainerCard.js).
export default function AboutIntro({ projectCount }) {
  return (
    <section
      id="about-intro"
      className="page-container scroll-mt-24 pt-24 font-custom lg:pt-32"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-16">
        <TrainerSide />
        <TrainerCard projectCount={projectCount} />
      </div>
    </section>
  );
}
