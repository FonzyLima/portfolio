import React from "react";
import Home from "@/app/page";
import NavLab from "./NavLab";

// Private nav sandbox (noindex via src/app/lab/layout.js). The home page is an
// async Server Component, so it's rendered here on the server and handed to
// the client-side NavLab (preview nav + variant bar) as children.
// Same cadence as / for the Sanity query.
export const revalidate = 3600;

export default function NavLabPage() {
  return (
    <NavLab>
      <Home />
    </NavLab>
  );
}
