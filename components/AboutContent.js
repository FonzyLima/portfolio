import React from "react";
import SlidingText from "./SlidingText";
import Reveal from "./Reveal";
import AboutIntro from "./AboutIntro";
import Resume from "./Resume";
import { profile } from "@/app/data/portfolioData";

// Shared body of the About page. `intro` (More About Me), `skills` (Technical
// Skills) and `resume` (My Resume) are slots so the /lab page can render the
// real page with different variants of those sections.
export default function AboutContent({
  intro = <AboutIntro />,
  skills,
  resume = <Resume />,
}) {
  return (
    <div className="">
      <Reveal immediate>{intro}</Reveal>
      <Reveal>
        <div className="section-gap">
          <SlidingText
            text={profile.skillsPrimary}
            direction={-1}
          />
          <SlidingText
            text={profile.skillsSecondary}
            direction={1}
          />
        </div>
      </Reveal>

      <Reveal>{skills}</Reveal>

      <Reveal>{resume}</Reveal>
    </div>
  );
}
