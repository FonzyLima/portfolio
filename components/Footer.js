import React from "react";
import { FiArrowUpRight, FiGithub, FiInstagram, FiLinkedin, FiMail } from "react-icons/fi";
import { FaDiscord } from "react-icons/fa";
import { profile, socials } from "@/app/data/portfolioData";
import { buttonClass } from "./buttonStyles";
import LogoMark from "./LogoMark";
import CopyEmailButton from "./footer/CopyEmailButton";
import BackToTop from "./footer/BackToTop";
import VisitorCounter from "./footer/VisitorCounter";

// Icons by social label (see `socials` in portfolioData). Unknown labels
// just render without one.
const SOCIAL_ICONS = {
  linkedin: FiLinkedin,
  github: FiGithub,
  discord: FaDiscord,
  instagram: FiInstagram,
};

const footerLinkClass =
  "group inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 type-small text-fg hover:text-fg-muted transition-colors duration-150";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      aria-labelledby="contact-heading"
      className="section-gap border-t-[0.5px] border-solid border-line font-custom"
    >
      <div className="page-container flex flex-col items-center gap-6 pt-16 text-center lg:gap-8 lg:pt-20">
        <div className="flex flex-col items-center gap-4">
          {/* Focus target for "Contact" links (scrollToAnchor focuses the
              aria-labelledby heading). tabIndex -1 keeps it out of the tab order. */}
          <h2
            id="contact-heading"
            tabIndex={-1}
            className="type-h2 text-fg focus:outline-none"
          >
            Get in touch
          </h2>
          <p className="type-body max-w-[52ch] text-fg-muted">
            Have a project in mind, a role to fill, or just want to talk shop?
            Send me an email or find me on any of the channels below.
          </p>
        </div>

        {/* Email first: the most direct way to reach out. */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${profile.email}`} className={buttonClass("primary")}>
            <FiMail aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
            {profile.email}
          </a>
          <CopyEmailButton email={profile.email} />
        </div>

        <ul
          aria-label="Social links"
          className="flex flex-row flex-wrap justify-center gap-x-2 gap-y-1 lg:gap-x-6"
        >
          {socials.map(({ label, href }) => {
            const Icon = SOCIAL_ICONS[label.toLowerCase()];
            return (
              <li key={href}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={footerLinkClass}>
                  {Icon && <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />}
                  {label}
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-fg-muted motion-safe:transition-transform duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="page-container mt-16 lg:mt-20">
        <div className="flex flex-col-reverse items-center gap-2 border-t-[0.5px] border-solid border-line py-6 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2 type-small text-fg-muted">
            <LogoMark className="h-4 w-4 shrink-0" />
            <span>&copy; {year} {profile.name}</span>
            <span className="ml-2 hidden sm:inline">{profile.location}</span>
          </p>
          <VisitorCounter />
          <BackToTop className="sm:-mr-2" />
        </div>
      </div>
    </footer>
  );
}
