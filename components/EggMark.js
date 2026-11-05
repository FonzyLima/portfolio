"use client";

import { useEffect } from "react";
import { markEgg } from "@/app/lib/eggs";

/** Records that the visitor found an easter egg (src/app/lib/eggs.js). Renders nothing. */
export default function EggMark({ id }) {
  useEffect(() => {
    markEgg(id);
  }, [id]);
  return null;
}
