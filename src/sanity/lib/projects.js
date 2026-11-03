import imageUrlBuilder from "@sanity/image-url";
import { projects as localProjects } from "@/app/data/portfolioData";
import { dataset, isSanityConfigured, projectId, sanityClient } from "./client";

const imageBuilder = isSanityConfigured
  ? imageUrlBuilder({ projectId, dataset })
  : null;

const projectsQuery = `*[_type == "project"] | order(coalesce(order, 100) asc, _createdAt desc) {
  _id,
  name,
  date,
  category,
  description,
  image,
  tools,
  link,
  git,
  featured,
  order
}`;

function imageUrlFor(image) {
  if (!imageBuilder || !image) {
    // Small raster of public/gameboy.svg (the SVG is ~160 KB gzipped).
    return "/gameboy-fallback.png";
  }

  return imageBuilder.image(image).width(900).height(628).fit("crop").auto("format").url();
}

export async function getSanityProjects() {
  if (!sanityClient) {
    return [];
  }

  const projects = await sanityClient.fetch(projectsQuery);

  return projects.map((project) => ({
    ...project,
    image: imageUrlFor(project.image),
    featured: Boolean(project.featured),
    tools: project.tools || [],
  }));
}

/**
 * Projects for server rendering: Sanity when it's configured and has content,
 * otherwise the static list in portfolioData.js.
 * `source` is "sanity" or "local".
 *
 * If Sanity errors during the production build, the static list is used so the
 * build still succeeds. At runtime (ISR regeneration) the error is rethrown
 * instead: Next then keeps serving the last good page rather than caching the
 * static fallback for an hour.
 */
export async function getProjects() {
  try {
    const sanityProjects = await getSanityProjects();

    if (sanityProjects.length > 0) {
      return { source: "sanity", projects: sanityProjects };
    }
  } catch (error) {
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      throw error;
    }
    console.error("Failed to fetch Sanity projects; using the local list", error);
  }

  return { source: "local", projects: localProjects };
}
