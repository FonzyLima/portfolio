import React from 'react'
import Button from './Button'
export default function Footer() {
  return (
    <div className='flex flex-col items-center text-center font-custom mt-40 border-t-[0.5px] border-solid border-gray-600'>
        <div className='bg-primary text-secondary text-7xl text-center mt-20 font-semibold'>Get in Touch</div>
        <div className='text-tertiary text-[22px] w-4/5 mt-10'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt <br/>ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
        <Button title="Say Hello"/>

          <ul className="flex flex-row mt-20 space-x-12 mb-14">
            <li className="text-secondary text-[18px] font-normal ">LINKEDIN</li>
            <li className="text-secondary text-[18px] font-normal ">GITHUB</li>
            <li className="text-secondary text-[18px] font-normal ">DISCORD</li>
            <li className="text-secondary text-[18px] font-normal ">INSTAGRAM</li>
          </ul>
      <div className='text-tertiary text-[18px]'>Copyright &copy; Alfonso Gabriel V. Lima - 2023</div>
    </div>  
  )
}
