"use client";

import { useEffect, useMemo, useState } from "react";
import { projects as localProjects } from "@/app/data/portfolioData";

export function useProjects({ featuredOnly = false, limit } = {}) {
  const [projects, setProjects] = useState(localProjects);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (isMounted && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      } catch {
        // Keep the local fallback projects when the CMS is not configured or reachable.
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(() => {
    let selectedProjects = projects;

    if (featuredOnly) {
      selectedProjects = selectedProjects.filter((project) => project.featured);
    }

    if (limit) {
      selectedProjects = selectedProjects.slice(0, limit);
    }

    return selectedProjects;
  }, [featuredOnly, limit, projects]);
}
