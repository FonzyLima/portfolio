# Fonzy's Portfolio

Personal site of Alfonso Lima, full stack and AI engineer in Manila. Live at [alfonsolima.com](https://www.alfonsolima.com).

The site is built around a Game Boy. The hero is a GBA-style battle intro with a Charmander back sprite, and the Pokémon theme runs through the whole site: a trainer card on the About page, a Pokédex command palette, a partner that levels up as you explore, and a few easter eggs for anyone who looks closely.

## Features

- **Game Boy hero.** An animated battle intro rendered from a Figma export, with a FireRed-style action menu (Projects / About / Skills / Contact). Arrow keys or taps move the cursor, A or Enter selects, B or Escape closes. Respects `prefers-reduced-motion`.
- **Partner system.** Charmander gains experience on each page you visit for the first time, evolves into Charmeleon and Charizard, and can be nicknamed. Progress is stored in `localStorage` and restored before first paint so nothing flickers.
- **Trainer card.** The About intro is a trading-card-style trainer card: ID hashed from the GitHub handle, hometown, Pokédex count (number of projects), time played (since the first job), and one gym badge per company.
- **Pokédex command palette.** `⌘K` / `Ctrl+K`, the nav button, or the Game Boy menu opens a site-wide palette for pages, projects and actions.
- **GitHub activity.** Contribution graph and pinned repos on the About page, pulled from public GitHub pages with no token. Refreshes hourly.
- **Visitor counter.** "Trainers met" in the footer, backed by a hits.sh badge, one count per browser session.
- **Light, dark and shiny.** Theme follows the OS and is overridable from the nav. Shiny mode is an easter egg: the Konami code anywhere on the site, or poking Charmander ten times, turns every green accent gold and gives Charmander its shiny colours.
- **DevTools surprise.** Open the console and a wild Charmander appears, with a `pokedex` global that has a few commands.
- **Accessible by default.** Semantic HTML, keyboard-operable everything including the Game Boy, visible focus rings, 44px touch targets, live regions for state changes, and contrast checked in every theme.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Components) on React 19 |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) with semantic colour tokens as CSS variables |
| Content | Static data in `src/app/data/portfolioData.js`, with optional [Sanity](https://www.sanity.io) for projects |
| Animation | CSS transitions and keyframes, the Web Animations API and `IntersectionObserver`. No animation library. |
| Fonts | Wix Madefor Display (self-hosted, SIL Open Font License) and a pixel font baked into SVG paths |
| Hosting | [Vercel](https://vercel.com) |

## Getting started

Requires Node 20 or newer.

```bash
git clone https://github.com/FonzyLima/portfolio.git
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site renders fully from the static data with no environment variables set.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run sanity` | Run Sanity Studio locally on port 3333 |
| `npm run sanity:deploy` | Deploy the Studio to Sanity's hosting |

## Content

Almost everything on the site comes from one file, `src/app/data/portfolioData.js`: profile, experience, education, skills, projects, socials, the GitHub links and the visitor counter URL. Edit it and the pages, trainer card and Pokédex update together.

Projects can also be managed in Sanity. When the Sanity environment variables are set, the site fetches projects from your dataset and falls back to the static list if Sanity is unreachable. The schema is in `sanity/schemaTypes/project.js`.

### Environment variables

Copy `.env.example` to `.env.local`. All of these are optional.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID used by the site |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name, defaults to `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date |
| `SANITY_STUDIO_PROJECT_ID` | Same project ID, for the Studio |
| `SANITY_STUDIO_DATASET` | Same dataset, for the Studio |

No API tokens are needed anywhere. GitHub activity and the visitor counter read public data.

## Project structure

```
src/app/            Routes: / (home), /about, /projects, 404, and two API routes
src/app/data/       portfolioData.js, the single source of site content
src/app/lib/        Server-only helpers (GitHub, visitors) and client state (partner, shiny, eggs, palette)
components/         UI components; gameboy/, nav/, palette/, trainer/, footer/ group the bigger features
sanity/             Sanity schema types
src/sanity/lib/     Sanity client and project queries
scripts/            Asset generators (see below)
public/gameboy/     Derived Game Boy art: layered SVG, base plate, console sprites
fonts/              Self-hosted Wix Madefor Display
```

### Asset pipeline

The Game Boy art is derived, not hand-edited. `public/gameboy.svg` is the flat Figma export and the source of truth. The scripts in `scripts/` turn it into animatable layers and standalone sprites:

| Script | Output |
| --- | --- |
| `scripts/split-gameboy.mjs` | Layered and base SVGs in `public/gameboy/`, plus the art module the hero renders |
| `scripts/partner-art.mjs` | Charmeleon and Charizard art from the pixel grids in `scripts/partner/sprites.mjs` |
| `scripts/console-sprite.mjs` | Standalone Charmander SVG for the DevTools greeting |
| `scripts/status-font.mjs` | Pixel-font glyphs so any nickname can be drawn in the status box |

Run any of them with `node scripts/<name>.mjs` after changing the source art or sprite grids.

## Deployment

The site deploys to Vercel from `main`. Security headers, image optimisation for Sanity's CDN, long-lived caching for the Game Boy art and a redirect from the old `/portfolio` path to `/projects` are configured in `next.config.js`.

## Credits

Pokémon, Charmander and the Game Boy are trademarks of Nintendo, Game Freak and The Pokémon Company. This site is a fan homage made for a personal portfolio and is not affiliated with or endorsed by them.

Wix Madefor Display is used under the SIL Open Font License.
