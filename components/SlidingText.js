'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'


export default function SlidingText({text,direction}) {
    const firstLText = useRef(null);
    const secondLText = useRef(null);

    let xPercent = 0;

    useEffect(()=>{
        requestAnimationFrame(animation);

    })

    const animation = () =>{
        if(xPercent< -100 && direction==-1){
            xPercent=0;
        }
        else if(xPercent> 0 && direction==1){
            xPercent=-100;
        }
    
      
        gsap.set(firstLText.current,{xPercent:xPercent})
        gsap.set(secondLText.current,{xPercent:xPercent})
  
        requestAnimationFrame(animation)
        xPercent += 0.1 * direction;
        

    }

    return (
        <div className="">
            <div className='flex whitespace-nowrap overflow-x-hidden'>  
                <p className="font-normal text-[70px] lg:text-[100px] text-tertiary font-custom" ref={firstLText}>{text}</p>
                <p className="font-normal text-[70px] lg:text-[100px] text-tertiary font-custom" ref={secondLText}>{text}</p>
                
            </div>
            
            
            
        </div>
    )
}
