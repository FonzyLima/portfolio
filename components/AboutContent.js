import React from "react";
import SlidingText from "./SlidingText";
import Reveal from "./Reveal";
import AboutIntro from "./AboutIntro";
import TechnicalSkills from "./TechnicalSkills";
import GitHubActivity from "./GitHubActivity";
import Resume from "./Resume";
import { profile } from "@/app/data/portfolioData";

// Body of the About page. `projectCount` feeds the trainer card's Pokédex and
// `github` (getGitHubStats()) the GitHub activity row under the skills.
export default function AboutContent({ projectCount, github }) {
  return (
    <div className="">
      <Reveal immediate>
        <AboutIntro projectCount={projectCount} />
      </Reveal>
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

      <Reveal>
        <TechnicalSkills footer={<GitHubActivity stats={github} />} />
      </Reveal>

      <Reveal>
        <Resume />
      </Reveal>
    </div>
  );
}
