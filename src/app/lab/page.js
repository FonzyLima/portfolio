import React from "react";
import AboutContent from "../../../components/AboutContent";
import AboutIntro, { introVariants } from "../../../components/AboutIntro";
import { badgeStyles, trainerVariants } from "../../../components/TrainerCard";
import { sideVariants } from "../../../components/TrainerSide";
import Resume, { resumeVariants } from "../../../components/Resume";
import TechnicalSkills, {
  chipStyles,
  skillVariants,
} from "../../../components/TechnicalSkills";
import GitHubActivity from "../../../components/GitHubActivity";
import { getProjects } from "@/sanity/lib/projects";
import { getGitHubStats } from "@/app/lib/github";
import { github as githubLinks } from "@/app/data/portfolioData";
import LabClient from "./LabClient";
import { defaults, sections } from "./labState";

// The real About page with a floating bar for trying variants of its sections
// (private and noindex via ./layout.js). The variants live in the query
// string (e.g. /lab?section=skills&layout=tiles&chip=soft), so the sections
// render here on the server exactly as on /about, and LabClient (the bar)
// only swaps the query. Reading searchParams makes this route dynamic; the
// GitHub stats keep their hourly fetch cache.
const options = {
  section: sections,
  intro: introVariants,
  card: trainerVariants,
  side: sideVariants,
  badge: badgeStyles,
  layout: skillVariants,
  chip: chipStyles,
  resume: resumeVariants,
};

// Valid option id, or the default (so a stale or hand-edited URL can't select
// a variant that doesn't exist). VariantBar's pick() does the same, but it's
// in a client module, so the server can't call it.
const pick = (list, value, fallback) =>
  list.some((option) => option.id === value) ? value : fallback;

export default async function Lab({ searchParams }) {
  const params = await searchParams;
  const state = Object.fromEntries(
    Object.entries(defaults).map(([key, fallback]) => [
      key,
      pick(options[key], params[key], fallback),
    ]),
  );
  // Same sources as /about, so the Pokédex count and GitHub stats match.
  const [{ projects }, github] = await Promise.all([
    getProjects(),
    getGitHubStats(githubLinks),
  ]);

  return (
    <LabClient state={state} options={options}>
      <AboutContent
        intro={
          <AboutIntro
            variant={state.intro}
            card={state.card}
            side={state.side}
            badgeStyle={state.badge}
            projectCount={projects.length}
            contributions={github?.pastYear}
          />
        }
        skills={
          <TechnicalSkills
            variant={state.layout}
            chip={state.chip}
            footer={<GitHubActivity stats={github} />}
          />
        }
        resume={<Resume variant={state.resume} />}
      />
    </LabClient>
  );
}
