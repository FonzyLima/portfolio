import { NextResponse } from "next/server";
import { getProjects } from "@/sanity/lib/projects";
import { projects as localProjects } from "@/app/data/portfolioData";

export const dynamic = "force-dynamic";

// The pages fetch projects on the server; this endpoint stays for external
// callers. Let the CDN cache it briefly and serve stale while it refreshes.
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=86400";

export async function GET() {
  try {
    const data = await getProjects();
    return NextResponse.json(data, {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  } catch (error) {
    // Sanity is down: answer with the static list, but don't let the CDN keep it.
    console.error("Failed to fetch Sanity projects", error);
    return NextResponse.json(
      { source: "local", projects: localProjects },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
