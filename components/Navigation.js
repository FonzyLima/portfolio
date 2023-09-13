import React from 'react'
import Link from 'next/link'

export default function Navigation({page}) {

  return (
    
    <div className="bg-primary backdrop-filter backdrop-blur-md flex flex-row justify-between text-secondary border-b-2 border-[#EBEBEB66]">
        <div>
            <div className="pl-[80px] pt-[15px] text-[25px]">FonzyLima</div>

        </div>
        <div className="flex flex-row pl-[400px]">
            <Link href="/"><div className={`p-4 pt-[20px] text-[18px] hover:text-tertiary ${page=="home"?"text-fourtary":""}`}>Home</div></Link>
            <Link href="/about"><div className={`p-4 pt-[20px] text-[18px] hover:text-tertiary ${page=="abouts"?"text-fourtary":""}`}>About</div></Link>
            <Link href="/portfolio"><div className={`p-4 pt-[20px] text-[18px] hover:text-tertiary ${page=="portfolio"?"text-fourtary":""}`}>Portfolio</div></Link>
            <div className="p-4 pt-[20px] text-[18px]">Contact</div>
        </div>
        <div className="p-4 pt-[20px] pr-[100px]"> 
        <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.05 4.14005L4.66 3.75005C4.27 3.36005 3.64 3.37005 3.26 3.75005L3.25 3.76005C2.86 4.15005 2.86 4.78005 3.25 5.16005L3.64 5.55005C4.03 5.94005 4.65 5.94005 5.04 5.55005L5.05 5.54005C5.44 5.16005 5.44 4.52005 5.05 4.14005ZM2.01 10.5H0.99C0.44 10.5 0 10.94 0 11.49V11.5C0 12.05 0.44 12.49 0.99 12.49H2C2.56 12.5 3 12.06 3 11.51V11.5C3 10.94 2.56 10.5 2.01 10.5ZM11.01 0.550049H11C10.44 0.550049 10 0.990049 10 1.54005V2.50005C10 3.05005 10.44 3.49005 10.99 3.49005H11C11.56 3.50005 12 3.06005 12 2.51005V1.54005C12 0.990049 11.56 0.550049 11.01 0.550049ZM18.75 3.76005C18.36 3.37005 17.73 3.37005 17.34 3.75005L16.95 4.14005C16.56 4.53005 16.56 5.16005 16.95 5.54005L16.96 5.55005C17.35 5.94005 17.98 5.94005 18.36 5.55005L18.75 5.16005C19.14 4.77005 19.14 4.15005 18.75 3.76005ZM16.94 18.8601L17.33 19.25C17.72 19.64 18.35 19.64 18.74 19.25C19.13 18.8601 19.13 18.23 18.74 17.84L18.35 17.4501C17.96 17.0601 17.33 17.0701 16.95 17.4501C16.55 17.85 16.55 18.4701 16.94 18.8601ZM19 11.49V11.5C19 12.05 19.44 12.49 19.99 12.49H21C21.55 12.49 21.99 12.05 21.99 11.5V11.49C21.99 10.94 21.55 10.5 21 10.5H19.99C19.44 10.5 19 10.94 19 11.49ZM11 5.50005C7.69 5.50005 5 8.19005 5 11.5C5 14.81 7.69 17.5 11 17.5C14.31 17.5 17 14.81 17 11.5C17 8.19005 14.31 5.50005 11 5.50005ZM10.99 22.4501H11C11.55 22.4501 11.99 22.01 11.99 21.46V20.5C11.99 19.9501 11.55 19.51 11 19.51H10.99C10.44 19.51 10 19.9501 10 20.5V21.46C10 22.01 10.44 22.4501 10.99 22.4501ZM3.25 19.24C3.64 19.63 4.27 19.63 4.66 19.24L5.05 18.85C5.44 18.4601 5.43 17.83 5.05 17.4501L5.04 17.4401C4.65 17.0501 4.02 17.0501 3.63 17.4401L3.24 17.83C2.86 18.23 2.86 18.85 3.25 19.24Z" fill="#EBEBEB"/>
</svg>

        </div>
    </div>
  )
}
