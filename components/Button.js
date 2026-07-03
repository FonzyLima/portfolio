import React from "react";
import Link from "next/link";
export default function Button({ title, destination = "/" }) {
  return (
    <Link href={destination}>
      <div className="py-2 px-6 lg:py-3 text-[18px] lg:text-[20px] xl:text-[22px] duration-200 bg-[#61BC7A] text-secondary dark:text-primary dark:bg-[#7DF39D] hover:bg-[#6CD488] dark:hover:bg-[#7df39cc4] flex justify-center text-center rounded-[10px] items-center cursor-pointer">
        {title}
      </div>
    </Link>
  );
}
