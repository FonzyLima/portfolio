import React from 'react'
import Navigation from '../../../components/Navigation'
import SlidingText from '../../../components/SlidingText'
import Footer from '../../../components/Footer'
export default function about() {
  return (
    <div className="bg-primary">
        <Navigation/>
        <div className='flex flex-col text-left ml-[100px] font-custom'>
          <div className='text-secondary text-left text-[70px] font-semibold mt-20'>
            Lorem Ipsum dolor sit
          </div>
          <div className='text-tertiary text-left text-[40px] w-[1575px] mt-10'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
          <div className='text-tertiary text-left text-[40px] w-[1575px] mt-10'>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          </div>

        </div>
        <div className="mt-40 space-y-0">
          <SlidingText text="Backend Frontend Mobile Web Game Web3 Artificial Intelligence&nbsp;" direction={-1}/>
          <SlidingText text="ReactJS NextJS NodeJS Python Java C# C++ Solidity SQL&nbsp;" direction={1}/>
        </div>
        <Footer/>
    </div>
  )
}
