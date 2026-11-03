"use client";
import React from "react";
import Button from "./Button";
import { scrollToAnchor } from "@/app/lib/scrollToAnchor";

// <Button> to an in-page anchor (e.g. "#footer") that smooth-scrolls and moves
// focus there. Without JS it's a plain link, so the native jump still works.
export default function ScrollToButton({ title, target, variant, icon = "down" }) {
  return (
    <Button
      title={title}
      destination={target}
      variant={variant}
      icon={icon}
      onClick={(event) => scrollToAnchor(event, target)}
    />
  );
}
