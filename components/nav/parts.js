import { socials } from "@/app/data/portfolioData";
import LogoMark from "../LogoMark";
import { indicatorClass } from "./motion";
import { focusRing } from "./config";

// Pieces of the site nav (components/Navigation.js).

// Link label plus its current-page underline. On desktop (`markerFor` set)
// every link has a marker, hidden unless active, so useMarkerSlide can slide
// it between links. In the mobile menu it's static and only the active link
// has one.
export function LinkLabel({ label, isActive, markerFor }) {
  const marker = markerFor ? (
    <span
      aria-hidden="true"
      data-marker={markerFor}
      className={`${indicatorClass} origin-left ${isActive ? "" : "invisible"}`}
    />
  ) : isActive ? (
    <span aria-hidden="true" className={indicatorClass} />
  ) : null;
  return (
    <span className="relative">
      {label}
      {marker}
    </span>
  );
}

export function LogoContent() {
  return (
    <>
      <LogoMark className="h-6 w-6 shrink-0 lg:h-8 lg:w-8" />
      <span>
        <span className="font-medium">Alfonso</span>{" "}
        <span className="text-fg-muted">Lima</span>
      </span>
    </>
  );
}

// Socials, so phone visitors can reach out without scrolling to the footer.
// Staggers in after the page links.
export function MenuSocials() {
  return (
    <ul aria-label="Social links" className="-mx-2 flex flex-wrap">
      {socials.map(({ label, href }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-[44px] items-center px-2 type-small text-fg-muted hover:text-fg ${focusRing} focus-visible:outline-offset-[-6px]`}
          >
            {label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
