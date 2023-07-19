import React from 'react'

export default function Footer() {
  return (
    <div className='flex flex-col items-center text-center'>
        <div className='bg-primary text-secondary text-7xl text-center mt-20 font-semibold'>Get in Touch</div>
        <div className='text-tertiary text-[22px] w-4/5 mt-10'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt <br/>ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
        <div className="p-3 mt-[30px] text-[22px] bg-[#7DF39D] w-[190px] h-[53px] text-center align-text-middle rounded-[10px] items-center">Say Hello</div>

          <ul className="flex flex-row mt-20 space-x-12">
            <li className="text-secondary text-[18px] font-normal ">LINKEDIN</li>
            <li className="text-secondary text-[18px] font-normal ">GITHUB</li>
            <li className="text-secondary text-[18px] font-normal ">DISCORD</li>
            <li className="text-secondary text-[18px] font-normal ">INSTAGRAM</li>
          </ul>

    </div>
  )
}
