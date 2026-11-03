import React from "react";
import Link from "next/link";
import { ButtonIcon, buttonClass } from "./buttonStyles";

// Site CTA, a link styled as a pill button (see components/buttonStyles.js).
//   variant: "primary" (default) or "secondary"
//   icon:    "next" (another page), "down" (further down this page) or
//            "external" (new tab); omit for none
// `onClick` is optional and forwarded to the Link (e.g. to smooth-scroll an
// in-page destination like "#footer"); it needs a client component parent.
export default function Button({ title, destination = "/", onClick, variant = "primary", icon }) {
  return (
    <Link href={destination} onClick={onClick} className={buttonClass(variant)}>
      {title}
      <ButtonIcon type={icon} />
    </Link>
  );
}
