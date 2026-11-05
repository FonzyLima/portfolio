"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { foundEggs } from "@/app/lib/eggs";
import { EXP, applyToHtml, gainExp } from "@/app/lib/partner";

// Pages whose first visit earns the partner experience (src/app/lib/partner.js).
const PAGES = ["/", "/projects", "/about"];

/**
 * Awards the partner's "first visit" experience per page and keeps <html>'s
 * partner attributes in step with storage. Also credits eggs found before the
 * partner existed (markEgg only awards at the moment of finding). Rendered
 * once from layout.js.
 */
export default function PartnerTracker() {
  const pathname = usePathname();
  useEffect(() => {
    applyToHtml();
    for (const id of foundEggs()) gainExp(`egg:${id}`, EXP.egg);
    if (PAGES.includes(pathname)) gainExp(`visit:${pathname}`, EXP.visit);
  }, [pathname]);
  return null;
}
