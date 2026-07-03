import { NextResponse } from "next/server";
import { projects as localProjects } from "@/app/data/portfolioData";
import { getSanityProjects } from "@/sanity/lib/projects";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sanityProjects = await getSanityProjects();

    if (sanityProjects.length > 0) {
      return NextResponse.json({
        source: "sanity",
        projects: sanityProjects,
      });
    }
  } catch (error) {
    console.error("Failed to fetch Sanity projects", error);
  }

  return NextResponse.json({
    source: "local",
    projects: localProjects,
  });
}
