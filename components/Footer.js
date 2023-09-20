import React from 'react'
import Button from './Button'
import Link from 'next/link'
export default function Footer() {
  return (
    <div className='flex flex-col items-center text-center font-custom mt-40 border-t-[0.5px] border-solid border-gray-600'>
        <div className='bg-primary text-secondary text-[40px] lg:text-[90px] text-center mt-20 font-semibold'>Get in Touch</div>
        <div className='text-tertiary text-[18px] lg:text-[30px] w-4/5 mt-10'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt <br/>ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</div>
        <Button title="Say Hello"/>

          <ul className="flex flex-row mt-20 space-x-8 lg:space-x-12 mb-14">
            <Link href="https://www.linkedin.com/in/alfonso-lima/" target="_blank"><li className="hover:text-tertiary text-secondary text-[12px] lg:text-[18px] font-normal ">LINKEDIN</li> </Link>
            <Link href="https://github.com/FonzyLima" target="_blank"><li className="hover:text-tertiary text-secondary text-[12px] lg:text-[18px] font-normal ">GITHUB</li></Link>
            <Link href="/"><li className="hover:text-tertiary text-secondary text-[12px] lg:text-[18px] font-normal ">DISCORD</li></Link>
            <Link href="https://www.instagram.com/fonzylima/" target="_blank"><li className="hover:text-tertiary text-secondary text-[12px] lg:text-[18px] font-normal ">INSTAGRAM</li></Link>
          </ul>
      <div className='text-tertiary text-[12px] lg:text-[18px] pb-8'>Copyright &copy; Alfonso Gabriel V. Lima - 2023</div>
    </div>  
  )
}
