"use client";

import { useEffect, useMemo, useState } from "react";
import { projects as localProjects } from "@/app/data/portfolioData";

export function useProjects({ featuredOnly = false, limit } = {}) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          if (isMounted) {
            setProjects(localProjects);
          }
          return;
        }

        const data = await response.json();

        if (isMounted) {
          if (Array.isArray(data.projects) && data.projects.length > 0) {
            setProjects(data.projects);
          } else {
            setProjects(localProjects);
          }
        }
      } catch {
        if (isMounted) {
          setProjects(localProjects);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedProjects = useMemo(() => {
    let selectedProjects = projects;

    if (featuredOnly) {
      selectedProjects = selectedProjects.filter((project) => project.featured);
    }

    if (limit) {
      selectedProjects = selectedProjects.slice(0, limit);
    }

    return selectedProjects;
  }, [featuredOnly, limit, projects]);

  return { projects: selectedProjects, isLoading };
}
