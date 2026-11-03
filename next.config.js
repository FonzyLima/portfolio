// Public assets keep their filenames when their content changes (e.g.
// scripts/split-gameboy.mjs rewrites public/gameboy/base.svg in place), so they
// can't be cached as immutable. Cache for a day, then revalidate in the background.
const PUBLIC_ASSET_CACHE = "public, max-age=86400, stale-while-revalidate=604800";

// Baseline security headers for every route. No full CSP yet: it would need a
// hash for the inline theme script in src/app/layout.js; frame-ancestors alone
// is safe and blocks clickjacking.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Only this project's Sanity images may go through the image optimizer.
const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: sanityProjectId ? `/images/${sanityProjectId}/**` : "/images/**",
      },
    ],
  },
  async headers() {
    const cache = [{ key: "Cache-Control", value: PUBLIC_ASSET_CACHE }];
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Gameboy hero art.
      { source: "/gameboy/:path*", headers: cache },
      // Project thumbnails and the Sanity fallback image (top-level PNGs in /public).
      { source: "/:file([^/]+\\.png)", headers: cache },
    ];
  },
}

module.exports = nextConfig
