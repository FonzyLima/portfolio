import React from "react";
import Image from "next/image";
import Link from "next/link";

function ProjectLink({ href, children }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[14px] lg:text-[18px] underline text-primary dark:text-secondary hover:text-sixtary dark:hover:text-fourtary duration-200"
    >
      {children}
    </Link>
  );
}

export default function Project({
  name,
  date,
  category,
  description,
  image,
  link = "",
  git = "",
  tools = [],
  words = [],
}) {
  const projectTools = tools.length > 0 ? tools : words.slice(1);

  return (
    <article className="w-full max-w-[520px] overflow-hidden rounded-[8px] bg-secondary dark:bg-[#171717] shadow-proj">
      <div className="relative aspect-[605/422] w-full overflow-hidden bg-[#d8d8d8] dark:bg-[#202020]">
        <Image
          alt={`${name} project thumbnail`}
          src={image}
          fill
          sizes="(min-width: 1024px) 520px, calc(100vw - 48px)"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-5 px-6 py-7 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-[#61BC7A] px-4 py-2 text-[12px] text-secondary dark:bg-fourtary dark:text-primary lg:text-[14px]">
            {category}
          </div>
          <div className="text-[14px] text-fiftary dark:text-tertiary lg:text-[18px]">
            {date}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-[26px] font-semibold text-primary dark:text-secondary lg:text-[40px]">
            {name}
          </h2>
          <p className="text-[18px] leading-[147.5%] text-fiftary dark:text-tertiary lg:text-[22px]">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {projectTools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-[#171717] px-3 py-1 text-[12px] text-primary dark:border-[#EBEBEB] dark:text-secondary lg:text-[14px]"
            >
              {tool}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-5 pt-1">
          {link && <ProjectLink href={link}>View project</ProjectLink>}
          {git && <ProjectLink href={git}>Source code</ProjectLink>}
          {!link && !git && (
            <div className="text-[14px] text-fiftary dark:text-tertiary lg:text-[18px]">
              Private project
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
