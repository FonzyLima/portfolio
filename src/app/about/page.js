import React from "react";
import AboutContent from "../../../components/AboutContent";
import { getProjects } from "@/sanity/lib/projects";
import { getGitHubStats } from "@/app/lib/github";
import { github as githubLinks } from "@/app/data/portfolioData";

// Same cadence as the home and Portfolio pages; also keeps the trainer card's
// "time played", the resume durations and the GitHub stats current.
export const revalidate = 3600;

export const metadata = {
  title: "About",
  description:
    "Experience, skills, and background of Alfonso Lima, AI Engineer at Tenext AI.",
};

export default async function About() {
  // Same project source as the Portfolio page, so the Pokédex count matches.
  const [{ projects }, github] = await Promise.all([getProjects(), getGitHubStats(githubLinks)]);

  return <AboutContent projectCount={projects.length} github={github} />;
}
