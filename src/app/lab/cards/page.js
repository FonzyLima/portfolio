import React from "react";
import Portfolio from "@/app/portfolio/page";
import CardLab from "./CardLab";

// Private project-card sandbox (noindex via src/app/lab/layout.js). The real
// /portfolio page is an async Server Component, so it's rendered here on the
// server and handed to the client-side CardLab (variant bar + context) as
// children. Same cadence as /portfolio for the Sanity query.
export const revalidate = 3600;

export default function CardLabPage() {
  return (
    <CardLab>
      <Portfolio />
    </CardLab>
  );
}
