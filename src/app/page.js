import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import Project from '../../components/Project'
import Button from '../../components/Button'
import SlidingText from '../../components/SlidingText'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {


  return (
    <div className="bg-primary">
      <Navigation page="home"/>
      {/* Introduction Start*/}
      <div className="flex flex-col ml-[30px] text-left pt-[60px] items-left md:text-center md:items-center">
        <div className="text-tertiary text-[18px] md:text-[22px]">Hi there! &#128075; I am</div>
        <div className="text-secondary text-[40px] md:text-[90px]">Fonzy Lima</div>
        <div className="text-secondary text-[40px] md:text-[90px]">Software Developer</div>
        <div className="text-tertiary text-[18px] md:text-[22px]">A Software Developer based in Manila, Philippines</div>
        <Button title="Get in touch"/>
      </div>
      <div className='hidden md:flex flex-row justify-center mt-20'>
      <Image
        src="/gameboy.svg"
        alt="Gameboy"
        
        width={960}
        height={510}
        />
      </div>
      <div className='md:hidden flex flex-row justify-center mt-10'>
      <Image
        src="/gameboy.svg"
        alt="Gameboy"
        
        width={360}
        height={210}
        />
      </div>
      
      {/* Introduction End */}
      {/* Green Orb */}
      {/* <div className="min-h-screen  flex items-center absolute">
      <svg className="w-full h-full" viewBox="0 0 1440 1039" fill="none" xmlns="http://www.w3.org/2000/svg">
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

      </div> */}
      <div className="flex flex-col text-left items-center font-custom">
        <div className="text-secondary text-left text-[70px] font-semibold mt-20">Who I am</div>
        <div className="text-tertiary text-left text-[40px] max-w-[775px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <br/><br/>
        </div>
        <div className="text-tertiary text-left text-[40px] max-w-[775px]">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div> 
      </div>
      <div className="flex flex-col text-left items-center font-custom ">
        <div className='text-secondary text-left text-[70px] font-semibold mt-20'>Portfolio</div>
        <div className="flex flex-row space-x-6 mt-12">
          <Project name="Bok Fried Chicken" date="December 2021"/>
          <Project name="Bok Fried Chicken" date="December 2022"/>
        </div>
        <div className="flex flex-row space-x-6 mt-12">
          <Project name="Bok Fried Chicken" date="December 2021"/>
          <Project name="Bok Fried Chicken" date="December 2022"/>
        </div>
        <Button title="More Projects"/>
      </div>
      <div className="mt-40 space-y-0">
        <SlidingText text="Backend Frontend Mobile Web Game Web3 Artificial Intelligence&nbsp;" direction={-1}/>
        <SlidingText text="ReactJS NextJS NodeJS Python Java C# C++ PHP SQL&nbsp;" direction={1}/>
      </div>

      <Footer/>
    </div>
  )
}
