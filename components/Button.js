import React from "react";
import Link from "next/link";
export default function Button({ title, destination = "/" }) {
  return (
    <Link href={destination}>
      <div className="py-2 px-6 lg:px-6 lg:py-3 text-[18px] lg:text-[22px] duration-200 bg-[#7DF39D] hover:bg-[#7df39cc4] flex justify-center text-center rounded-[10px] items-center cursor-pointer">
        {title}
      </div>
    </Link>
  );
}
