import imageUrlBuilder from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId, sanityClient } from "./client";

const imageBuilder = isSanityConfigured
  ? imageUrlBuilder({ projectId, dataset })
  : null;

const projectsQuery = `*[_type == "project"] | order(coalesce(order, 100) asc, _createdAt desc) {
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
    return "/gameboy.svg";
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
