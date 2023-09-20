import React from "react";

export default function Button({ title }) {
  return (
    <div className="py-2 px-6 lg:px-6 lg:py-3 text-[18px] lg:text-[22px] w-[150px] lg:w-[190px] bg-[#7DF39D] flex justify-center text-center rounded-[10px] items-center">
      {title}
    </div>
  );
}
