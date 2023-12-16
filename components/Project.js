import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function Project({ name, date, image, link = "/", git = "/" }) {
  return (
    <div className="w-[344px] lg:w-1/2 rounded-t-lg shadow-proj relative flex flex-col items-center">
      <Image
        alt="Project Thumbnail"
        src={image}
        width={500}
        height={500}
      ></Image>
      <div className="absolute top-[230px] lg:top-[330px] bg-secondary flex-row justify-between w-[205px] lg:w-auto inline-block pr-4 rounded-full">
        <ul className="flex flex-row gap-2 items-center">
          <li className="text-[11px] lg:text-[18px] px-4 bg-fourtary h-full py-2 rounded-full">
            Website
          </li>
          <li className="text-[11px] lg:text-[18px] ml-[-5px]">Next.js</li>
          <li className="text-[11px] lg:text-[18px]">Python</li>
          <li className="text-[11px] lg:text-[18px]">Java</li>
        </ul>
      </div>
      <div className="bg-[#171717] rounded-bl-[30px] rounded-br-[30px] px-[28px] py-[45px] w-full">
        <div className="text-secondary text-[16px] lg:text-[30px] font-semibold">
          {name}
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="text-tertiary text-[14px] lg:text-[22px] ">
            {date}
          </div>
          <div className="flex flex-row gap-[12px] items-center justify-center">
            {git == "/" ? (<div className="hover:cursor-not-allowed">
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.7683 1C8.24056 1 1.3335 7.90706 1.3335 16.4348C1.3335 23.2647 5.7517 29.0334 11.887 31.0785C12.6588 31.2136 12.9482 30.7505 12.9482 30.3454C12.9482 29.9788 12.9289 28.7633 12.9289 27.4707C9.05089 28.1845 8.04763 26.5253 7.73893 25.6571C7.56529 25.2133 6.81284 23.8435 6.15687 23.4769C5.61665 23.1875 4.84491 22.4736 6.13757 22.4543C7.35306 22.4351 8.22127 23.5734 8.51067 24.0364C9.8998 26.3709 12.1186 25.7149 13.0061 25.3098C13.1411 24.3065 13.5463 23.6312 13.99 23.2454C10.5558 22.8595 6.96719 21.5283 6.96719 15.6245C6.96719 13.9459 7.56529 12.5568 8.54926 11.4764C8.39491 11.0905 7.85469 9.50842 8.7036 7.38614C8.7036 7.38614 9.99627 6.98098 12.9482 8.96821C14.183 8.62092 15.4949 8.44728 16.8069 8.44728C18.1188 8.44728 19.4308 8.62092 20.6656 8.96821C23.6175 6.96168 24.9101 7.38614 24.9101 7.38614C25.759 9.50842 25.2188 11.0905 25.0645 11.4764C26.0484 12.5568 26.6465 13.9266 26.6465 15.6245C26.6465 21.5476 23.0387 22.8595 19.6044 23.2454C20.1639 23.7277 20.6463 24.6538 20.6463 26.1008C20.6463 28.1652 20.627 29.8245 20.627 30.3454C20.627 30.7505 20.9164 31.2329 21.6881 31.0785C24.7522 30.0441 27.4148 28.0749 29.301 25.448C31.1873 22.8211 32.2022 19.6688 32.2031 16.4348C32.2031 7.90706 25.296 1 16.7683 1Z"
                  stroke="#A9A9A9"
                  strokeWidth="1.54348"
                  strokeLinejoin="round"
                />
              </svg>
              </div>
            ) : (
              <Link href={git} target="_blank">
                <svg
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.7683 1C8.24056 1 1.3335 7.90706 1.3335 16.4348C1.3335 23.2647 5.7517 29.0334 11.887 31.0785C12.6588 31.2136 12.9482 30.7505 12.9482 30.3454C12.9482 29.9788 12.9289 28.7633 12.9289 27.4707C9.05089 28.1845 8.04763 26.5253 7.73893 25.6571C7.56529 25.2133 6.81284 23.8435 6.15687 23.4769C5.61665 23.1875 4.84491 22.4736 6.13757 22.4543C7.35306 22.4351 8.22127 23.5734 8.51067 24.0364C9.8998 26.3709 12.1186 25.7149 13.0061 25.3098C13.1411 24.3065 13.5463 23.6312 13.99 23.2454C10.5558 22.8595 6.96719 21.5283 6.96719 15.6245C6.96719 13.9459 7.56529 12.5568 8.54926 11.4764C8.39491 11.0905 7.85469 9.50842 8.7036 7.38614C8.7036 7.38614 9.99627 6.98098 12.9482 8.96821C14.183 8.62092 15.4949 8.44728 16.8069 8.44728C18.1188 8.44728 19.4308 8.62092 20.6656 8.96821C23.6175 6.96168 24.9101 7.38614 24.9101 7.38614C25.759 9.50842 25.2188 11.0905 25.0645 11.4764C26.0484 12.5568 26.6465 13.9266 26.6465 15.6245C26.6465 21.5476 23.0387 22.8595 19.6044 23.2454C20.1639 23.7277 20.6463 24.6538 20.6463 26.1008C20.6463 28.1652 20.627 29.8245 20.627 30.3454C20.627 30.7505 20.9164 31.2329 21.6881 31.0785C24.7522 30.0441 27.4148 28.0749 29.301 25.448C31.1873 22.8211 32.2022 19.6688 32.2031 16.4348C32.2031 7.90706 25.296 1 16.7683 1Z"
                    stroke="#A9A9A9"
                    strokeWidth="1.54348"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
            {link=="/" ? <div className="hover:cursor-not-allowed"><svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.3333 1.70618V8.76208M26.3333 1.70618H19.2774M26.3333 1.70618L15.7495 12.29M22.8054 14.054V23.3149C22.8054 25.0198 21.4233 26.4018 19.7184 26.4018H4.72465C3.01977 26.4018 1.6377 25.0198 1.6377 23.3149V8.32108C1.6377 6.6162 3.01977 5.23413 4.72465 5.23413H13.9855"
                  stroke="#A9A9A9"
                  strokeWidth="1.54348"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg></div> :<Link href={link} target="_blank"> <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.3333 1.70618V8.76208M26.3333 1.70618H19.2774M26.3333 1.70618L15.7495 12.29M22.8054 14.054V23.3149C22.8054 25.0198 21.4233 26.4018 19.7184 26.4018H4.72465C3.01977 26.4018 1.6377 25.0198 1.6377 23.3149V8.32108C1.6377 6.6162 3.01977 5.23413 4.72465 5.23413H13.9855"
                  stroke="#A9A9A9"
                  strokeWidth="1.54348"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              </Link> }
            
          </div>
        </div>
      </div>
    </div>
  );
}
