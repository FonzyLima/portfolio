import React from 'react'
import Navigation from '../../../components/Navigation'
import SlidingText from '../../../components/SlidingText'
import Footer from '../../../components/Footer'
export default function about() {
  return (
    <div className="bg-primary">
        <Navigation page="abouts"/>
        <div className='flex flex-col text-left px-24 font-custom'>
          <div className='text-secondary text-left text-[70px] font-semibold mt-20'>
            Lorem Ipsum dolor sit
          </div>
          <div className='text-tertiary text-left text-[40px] w-[1028px] mt-10'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
          <div className='text-tertiary text-left text-[40px] w-[1028] mt-10'>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          </div>

        </div>
        <div className="mt-40 space-y-0">
          <SlidingText text="Backend Frontend Mobile Web Game Artificial Intelligence&nbsp;" direction={-1}/>
          <SlidingText text="ReactJS NextJS NodeJS Python Java C# C++ PHP SQL&nbsp;" direction={1}/>
        </div>
        {/* Resume Start */}
        <div className='flex flex-col px-24 mt-40 gap-y-[90px]'>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-col gap-y-[10px] '>
              <div className='text-secondary text-[50px] font-custom font-semibold'>
                WTW
              </div>
              <div className='text-tertiary text-[22px] font-custom font-normal'>
                Dec 2022 - Jan 2023
              </div>
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <div className='text-fourtary text-[30px] font-custom font-normal'>
              DevOps Intern
              </div>
              <div className='text-tertiary text-[22px] w-[730px] font-custom font-normal'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
          </div>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-col gap-y-[10px] '>
              <div className='text-secondary text-[50px] font-custom font-semibold'>
                WRSHealth
              </div>
              <div className='text-tertiary text-[22px] font-custom font-normal'>
                June 2023 - September 2023
              </div>
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <div className='text-fourtary text-[30px] font-custom font-normal'>
              Software Engineering Intern
              </div>
              <div className='text-tertiary text-[22px] w-[730px] font-custom font-normal'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
          </div>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-col gap-y-[10px] '>
              <div className='text-secondary text-[50px] font-custom font-semibold'>
                WTW
              </div>
              <div className='text-tertiary text-[22px] font-custom font-normal'>
                Dec 2022 - Jan 2023
              </div>
            </div>
            <div className='flex flex-col gap-y-[10px]'>
              <div className='text-fourtary text-[30px] font-custom font-normal'>
              DevOps Intern
              </div>
              <div className='text-tertiary text-[22px] w-[730px] font-custom font-normal'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </div>
          </div>
        </div>
        <Footer/>
    </div>
  )
}
