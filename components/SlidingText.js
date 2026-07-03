"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SlidingText({ text, direction }) {
  const firstLText = useRef(null);
  const secondLText = useRef(null);
  const xPercent = useRef(0);
  const animationFrame = useRef(null);

  useEffect(() => {
    const animation = () => {
      if (xPercent.current < -100 && direction === -1) {
        xPercent.current = 0;
      } else if (xPercent.current > 0 && direction === 1) {
        xPercent.current = -100;
      }

      gsap.set(firstLText.current, { xPercent: xPercent.current });
      gsap.set(secondLText.current, { xPercent: xPercent.current });

      xPercent.current += 0.1 * direction;
      animationFrame.current = requestAnimationFrame(animation);
    };

    animationFrame.current = requestAnimationFrame(animation);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    }
  }, [direction]);

  return (
    <div className="">
      <div className="flex whitespace-nowrap overflow-x-hidden">
        <p
          className="font-normal text-[56px] md:text-[72px] xl:text-[100px] text-fiftary dark:text-tertiary font-custom"
          ref={firstLText}
        >
          {text}
        </p>
        <p
          className="font-normal text-[56px] md:text-[72px] xl:text-[100px] text-fiftary dark:text-tertiary font-custom"
          ref={secondLText}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
