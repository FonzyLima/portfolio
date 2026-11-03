// The Studio only exposes SANITY_STUDIO_* variables to the browser, so set
// SANITY_STUDIO_PROJECT_ID (e.g. in .env.local). Fail loudly instead of silently
// pointing the Studio at a project that doesn't exist.
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing Sanity project ID: set SANITY_STUDIO_PROJECT_ID in .env.local (see sanity.io/manage)."
  );
}

const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  "production";

const config = {
  api: {
    projectId,
    dataset,
  },
};

export default config;
