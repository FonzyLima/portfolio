import React from "react";
import Reveal from "../../../components/Reveal";
import ExperimentCard from "../../../components/lab/ExperimentCard";
import { experiments } from "@/app/data/labData";

// Server Component: only the live demos inside the cards are client code.
export default function Experiments() {
  return (
    <Reveal>
      <section className="page-container flex flex-col pb-[18px] pt-24 font-custom lg:pt-32">
        <div className="flex flex-col gap-6 lg:gap-8">
          <h1 className="type-h2 text-fg">Lab</h1>
          <p className="type-lead max-w-[65ch] text-fg-muted">
            Small interface experiments from around this site, with live
            demos where they fit.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:mt-10 lg:gap-8">
          {experiments.map(({ id, ...experiment }) => (
            <ExperimentCard key={id} {...experiment} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}
