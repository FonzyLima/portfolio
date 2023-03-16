import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Navigation from '../../components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="bg-primary">
      <Navigation/>
      {/* Introduction Start*/}
      <div className="flex flex-col text-center pt-[60px] items-center">
        <div className="text-tertiary text-[22px]">Hi there! &#128075; I am</div>
        <div className="text-secondary text-[90px]">Fonzy Lima</div>
        <div className="text-secondary text-[90px]">Software Developer</div>
        <div className="text-tertiary text-[22px]">A Software Developer based in Manila, Philippines</div>
        <div className="p-3 mt-[30px] text-[22px] bg-[#7DF39D] w-[190px] h-[53px] text-center align-text-middle rounded-[10px] items-center">Get in touch</div>
      </div>
      {/* Introduction End */}
      {/* Green Orb */}
      <div className="mt-[-200px] absolute">
      <svg width="1440" height="1039" viewBox="0 0 1440 1039" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_f_112_5118)">
<ellipse cx="720" cy="519.974" rx="673" ry="462" fill="url(#paint0_radial_112_5118)" fill-opacity="0.4"/>
</g>
<defs>
<filter id="filter0_f_112_5118" x="-10" y="0.973633" width="1460" height="1038" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="28.5" result="effect1_foregroundBlur_112_5118"/>
</filter>
<radialGradient id="paint0_radial_112_5118" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(720 519.974) rotate(90) scale(462 673)">
<stop stop-color="#00FC83"/>
<stop offset="1" stop-color="#00FC83" stop-opacity="0"/>
</radialGradient>
</defs>
</svg>

      </div>
      <div className="flex flex-col text-left items-center ">
        <div className="text-secondary text-left text-[70px] ">Who I am</div>
        <div className="text-tertiary text-left text-[40px] w-[775px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
        <div className="text-tertiary text-left text-[40px] w-[775px]">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
      </div>
    </div>
  )
}
