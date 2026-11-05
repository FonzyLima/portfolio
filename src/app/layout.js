import "./globals.css";
import localFont from "next/font/local";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import { DarkContextProvider } from "./context/darkContext";
import ShinyMode from "../../components/ShinyMode";
import DevtoolsSurprise from "../../components/DevtoolsSurprise";
import CommandPalette from "../../components/palette/CommandPalette";
import PartnerTracker from "../../components/PartnerTracker";

// WixMadeForDisplay, Latin subset as woff2 (generated from the TTFs in /fonts
// with pyftsubset). next/font preloads the files and adds a size-adjusted
// Arial fallback, so the swap doesn't shift layout. Exposed as --font-wix,
// which Tailwind's `font-custom` reads.
// Regenerate (e.g. to add glyphs) from the TTF masters, inside /fonts:
//   pyftsubset WixMadeforDisplay-<Weight>.ttf --flavor=woff2 --layout-features='*' \
//     --output-file=WixMadeforDisplay-<Weight>.woff2 \
//     --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD"
const wix = localFont({
  src: [
    {
      path: "../../fonts/WixMadeforDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/WixMadeforDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/WixMadeforDisplay-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-wix",
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata = {
  title: {
    default: "Alfonso Lima | Full Stack & AI Engineer",
    template: "%s | Alfonso Lima",
  },
  description:
    "Full stack and AI engineer in Manila building web, mobile, and AI apps with Next.js, React Native, and Django. Projects, experience, and contact.",
};

// Browser UI colour follows the OS scheme (matches the --page token).
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EBEBEB" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

// Runs before first paint so the page never flashes the wrong theme: the
// stored choice wins, otherwise the OS preference. Keep in sync with
// src/app/context/darkContext.js. The `shiny` class (src/app/lib/shiny.js) and the
// partner's stage (`data-partner`, src/app/lib/partner.js) are restored the same way.
// It also adds `js` first, which <Reveal> uses to only hide content when JS runs.
const themeScript = `{const d=document.documentElement;d.classList.add('js');try{const s=localStorage.getItem('theme');const t=s||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;if(localStorage.getItem('shiny')==='1')d.classList.add('shiny');const p=JSON.parse(localStorage.getItem('partner')||'null');if(p){d.dataset.partner=String(p.shown||0);if(p.shown||p.nick||p.exp)d.dataset.partnerCustom='';}}catch(e){}}`;

export default function RootLayout({ children }) {
  return (
    // The theme script changes <html>'s class/style before React hydrates.
    <html lang="en" className={wix.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body className=" font-custom">
        <DarkContextProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-surface focus:px-4 focus:py-3 focus:text-fg focus:shadow-1 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent-strong type-small"
          >
            Skip to content
          </a>
          <ShinyMode />
          <DevtoolsSurprise />
          <CommandPalette />
          <PartnerTracker />
          <Navigation />
          <main id="main" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <Footer />
        </DarkContextProvider>
      </body>
    </html>
  );
}
