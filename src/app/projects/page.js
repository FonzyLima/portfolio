import React from "react";
import Reveal from "../../../components/Reveal";
import PortfolioFilters from "../../../components/PortfolioFilters";
import Link from "next/link";
import { getProjects } from "@/sanity/lib/projects";
import { socials } from "@/app/data/portfolioData";

// Rebuild the page (and re-query Sanity) at most once an hour.
export const revalidate = 3600;

export const metadata = {
  title: "Projects",
  description:
    "Websites, mobile apps, games, and bots by Alfonso Lima, with live links and source code.",
};

export default async function Projects() {
  const { projects } = await getProjects();
  const github = socials.find((social) => social.label === "GitHub");

  return (
    <div className="">
      <section className="page-container flex flex-col pb-[18px] pt-24 font-custom lg:pt-32">
        <Reveal immediate>
          <div className="flex flex-col gap-6 lg:gap-8">
            <h1 className="type-h2 text-fg">
              Projects
            </h1>
            <div className="flex flex-col gap-4">
              <div className="type-lead max-w-[65ch] font-normal text-fg-muted">
                Websites, mobile apps, games, and bots I’ve built, with live links and source code where they’re public.
              </div>
              <div className="type-body text-fg-muted">
                More on my{" "}
                <Link
                  href={github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-fg hover:text-accent-strong transition-colors duration-150"
                >
                  GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </Link>
                .
              </div>
            </div>
          </div>
        </Reveal>

        {/* Grid is above the fold on mobile and holds the LCP image, so it
            must not wait on the scroll observer. */}
        <Reveal immediate delay={60}>
          <PortfolioFilters projects={projects} />
        </Reveal>
      </section>
    </div>
  );
}
