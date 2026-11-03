"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { buttonClass } from "../buttonStyles";

// Secondary pill next to the mailto button: copies the address for people
// whose mail link opens the wrong app (or nothing). The label flips to
// "Copied" for 2s and a polite live region announces it.
export default function CopyEmailButton({ email }) {
  const [status, setStatus] = useState("idle"); // idle | copied | failed
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  const copied = status === "copied";
  const Icon = copied ? FiCheck : FiCopy;

  return (
    <>
      <button type="button" onClick={copy} className={buttonClass("secondary")}>
        <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
        {/* Fixed width so the button doesn't jump when the label changes. */}
        <span className="inline-block min-w-[5.5ch] text-left">
          {copied ? "Copied" : "Copy"}
        </span>
        <span className="sr-only"> email address</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied
          ? "Email address copied"
          : status === "failed"
          ? "Couldn't copy. The address is " + email
          : ""}
      </span>
    </>
  );
}
