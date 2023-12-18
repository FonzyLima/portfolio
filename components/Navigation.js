"use client";
import React from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
export default function Navigation({ page }) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const variants = {
    open: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
    closed: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };
  const mobileNavContainerVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };
  const mobileNavListVariant = {
    hidden: { y: -20, opacity: 0 },
    show: { opacity: 1, y: 0 },
  };

  const mobileNavExitProps = {
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };
  const [showMenu, setshowMenu] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const hideNavbar = scrollY > 100 && scrollDirection === "down";

  return (
    <nav
      className={`w-full bg-[#EBEBEB] dark:bg-navprimary text-primary dark:text-secondary backdrop-filter backdrop-blur-md border-b-[0.5px] border-[#171717] dark:border-[#EBEBEB] font-custom fixed z-40 top-0 transition-transform duration-300 ease-in-out ${
        hideNavbar ? "hidden-nav" : ""
      }`}
    >
      <div className="w-full flex flex-row justify-between">
        <div>
          <Link href="/">
            <div className="pl-[16px] lg:pl-[96px] pt-[15px] text-[25px] font-custom hover:cursor-pointer">
              AlfonsoLima
            </div>
          </Link>
        </div>
        <div className="flex-row flex">
          <div
            className="flex md:hidden p-4 pt-[25px] text-[18px] hover:text-tertiary"
            onClick={() => setshowMenu(!showMenu)}
          >
            <GiHamburgerMenu />
          </div>

          <Link href="/">
            <div
              className={`md:flex hidden p-4 pt-[20px] text-[18px] hover:text-tertiary ${
                page == "home" ? "text-[#61BC7A] dark:text-fourtary" : ""
              }`}
            >
              Home
            </div>
          </Link>
          <Link href="/about">
            <div
              className={`lg:flex hidden p-4 pt-[20px] text-[18px] hover:text-tertiary ${
                page == "abouts" ? "text-[#61BC7A] dark:text-fourtary" : ""
              }`}
            >
              About
            </div>
          </Link>
          <Link href="/portfolio">
            <div
              className={`md:flex hidden p-4 pt-[20px] text-[18px] hover:text-tertiary ${
                page == "portfolio" ? "text-[#61BC7A] dark:text-fourtary" : ""
              }`}
            >
              Portfolio
            </div>
          </Link>
          <div className="md:flex hidden p-4 pt-[20px] text-[18px]">
            Contact
          </div>
        </div>
      </div>
      {/* {showMenu ? <div className="transition-transform duration-500 ease-in-out">
        <div className="w-full flex justify-center text-[18px] p-1">Home</div>
        <div className="w-full flex justify-center text-[18px] p-1">About</div>
        <div className="w-full flex justify-center text-[18px] p-1">Portfolio</div>
      </div>:null} */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            variants={mobileNavContainerVariant}
            initial="hidden"
            animate="show"
            className={`flex flex-col transition duration-500 ease-out`}
          >
            <Link href="/">
              <motion.div
                variants={mobileNavListVariant}
                {...mobileNavExitProps}
                className={`w-full flex justify-center text-[18px] font-custom p-1 ${
                  page == "home" ? "text-fourtary" : ""
                }`}
              >
                Home
              </motion.div>
            </Link>
            <Link href="/about">
              <motion.div
                variants={mobileNavListVariant}
                {...mobileNavExitProps}
                className={`w-full flex justify-center text-[18px] font-custom p-1 ${
                  page == "abouts" ? "text-fourtary" : ""
                }`}
              >
                About
              </motion.div>
            </Link>

            <Link href="/portfolio">
              <motion.div
                variants={mobileNavListVariant}
                {...mobileNavExitProps}
                className={`w-full flex justify-center text-[18px] font-custom p-1 pb-4 ${
                  page == "portfolio" ? "text-fourtary" : ""
                }`}
              >
                Portfolio
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
