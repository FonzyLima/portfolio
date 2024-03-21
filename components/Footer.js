import React from "react";
import Button from "./Button";
import Link from "next/link";
export default function Footer() {
  return (
    <div id="footer" className="flex flex-col items-center text-center font-custom mt-40 border-t-[0.5px] border-solid border-gray-600 gap-[15px] lg:gap-[30px] pt-16">
      <div className="text-primary dark:text-secondary text-[40px] lg:text-[70px] text-center font-semibold">
        Get in Touch
      </div>
      <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[22px] w-4/5 text-center">
      Feel free to reach out and connect with me through any of the following channels.<br/> I&apos;m available and eager to engage with you
      </div>
   

      <ul className="flex flex-row mt-20 space-x-8 lg:space-x-12 mb-14">
        <Link href="https://www.linkedin.com/in/alfonso-lima/" target="_blank">
          <li className="underline text-primary hover:text-tertiary dark:hover:text-tertiary dark:text-secondary text-[12px] lg:text-[18px] font-normal ">
            LINKEDIN
          </li>{" "}
        </Link>
        <Link href="https://github.com/FonzyLima" target="_blank">
        <li className="underline text-primary hover:text-tertiary dark:hover:text-tertiary dark:text-secondary text-[12px] lg:text-[18px] font-normal ">
            GITHUB
          </li>
        </Link>
        <Link
          href="https://discord.com/users/702050752490897479"
          target="_blank"
        >
          <li className="underline text-primary hover:text-tertiary dark:hover:text-tertiary dark:text-secondary text-[12px] lg:text-[18px] font-normal ">
            DISCORD
          </li>
        </Link>
        <Link href="https://www.instagram.com/fonzylima/" target="_blank">
        <li className="underline text-primary hover:text-tertiary dark:hover:text-tertiary dark:text-secondary text-[12px] lg:text-[18px] font-normal ">
            INSTAGRAM
          </li>
        </Link>
      </ul>
      <div className="text-fiftary dark:text-tertiary text-[12px] lg:text-[18px] pb-8">
        Copyright &copy; Alfonso Gabriel V. Lima - 2024
      </div>
    </div>
  );
}
