import React from "react";
import AboutContent from "../../../components/AboutContent";
import AboutIntro from "../../../components/AboutIntro";
import Resume from "../../../components/Resume";
import TechnicalSkills from "../../../components/TechnicalSkills";
import GitHubActivity from "../../../components/GitHubActivity";
import { getProjects } from "@/sanity/lib/projects";
import { getGitHubStats } from "@/app/lib/github";
import { github as githubLinks } from "@/app/data/portfolioData";

// Same cadence as the home and Portfolio pages; also keeps the trainer card's
// "time played", the resume durations and the GitHub stats current.
export const revalidate = 3600;

export default async function About() {
  // Same project source as the Portfolio page, so the Pokédex count matches.
  const [{ projects }, github] = await Promise.all([getProjects(), getGitHubStats(githubLinks)]);

  return (
    <AboutContent
      intro={
        <AboutIntro
          variant="trainer"
          card="tcg"
          side="facts"
          badgeStyle="initials"
          projectCount={projects.length}
          contributions={github?.pastYear}
        />
      }
      skills={
        <TechnicalSkills
          variant="panel"
          chip="badge"
          footer={<GitHubActivity stats={github} />}
        />
      }
      resume={<Resume variant="map" />}
    />
  );
}
