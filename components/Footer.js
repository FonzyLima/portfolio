import React from "react";
import Button from "./Button";
import Link from "next/link";
export default function Footer() {
  return (
    <div id="footer" className="flex flex-col items-center text-center font-custom mt-32 border-t-[0.5px] border-solid border-gray-600 gap-[15px] lg:gap-[24px] xl:gap-[30px] pt-16 xl:mt-40">
      <div className="text-primary dark:text-secondary text-[40px] lg:text-[56px] xl:text-[70px] text-center font-semibold">
        Get in Touch
      </div>
      <div className="text-fiftary dark:text-tertiary text-[18px] lg:text-[20px] xl:text-[22px] w-4/5 max-w-[760px] text-center">
      Feel free to reach out and connect with me through any of the following channels.<br/> I&apos;m available and eager to engage with you
      </div>
   

      <ul className="flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 mt-16 lg:gap-x-12 lg:mt-20 mb-14">
        <Link href="https://www.linkedin.com/in/alfonso-lima/" target="_blank">
          <li className="underline text-primary hover:text-tertiary dark:hover:text-tertiary dark:text-secondary text-[12px] lg:text-[16px] xl:text-[18px] font-normal ">
            LINKEDIN
          </li>{" "}
        </Link>
        <Link href="https://github.com/FonzyLima" target="_blank">
        <li className="underline text-primary hover:text-tertiary dark:hover:text-tertiary dark:text-secondary text-[12px] lg:text-[16px] xl:text-[18px] font-normal ">
            GITHUB
          </li>
        </Link>
        <Link
          href="https://discord.com/users/702050752490897479"
          target="_blank"
        >
          <li className="underline text-primary hover:text-tertiary dark:hover:text-tertiary dark:text-secondary text-[12px] lg:text-[16px] xl:text-[18px] font-normal ">
            DISCORD
          </li>
        </Link>
        <Link href="https://www.instagram.com/fonzylima/" target="_blank">
        <li className="underline text-primary hover:text-tertiary dark:hover:text-tertiary dark:text-secondary text-[12px] lg:text-[16px] xl:text-[18px] font-normal ">
            INSTAGRAM
          </li>
        </Link>
      </ul>
      <div className="text-fiftary dark:text-tertiary text-[12px] lg:text-[16px] xl:text-[18px] pb-8">
        Copyright &copy; Alfonso Gabriel V. Lima - 2026
      </div>
    </div>
  );
}
