'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'


export default function SlidingText() {
    const firstLText = useRef(null);
    const secondLText = useRef(null);
    // const firstRText = useRef(null);
    // const secondRText = useRef(null);
    let xPercent = 0;
    let xPercentR = 0;
    let directionL = -1;
    let directionR = 1;

    useEffect(()=>{
        requestAnimationFrame(animation);
    })

    const animation = () =>{
        if(xPercent<= -100){
            xPercent=0;
        }
        // if(xPercentR>0){
        //     xPercentR = -100;

        // }
        gsap.set(firstLText.current,{xPercent:xPercent})
        gsap.set(secondLText.current,{xPercent:xPercent})
        // gsap.set(firstRText.current,{xPercentR:xPercentR})
        // gsap.set(secondRText.current,{xPercentR:xPercentR})
        
        requestAnimationFrame(animation)
        xPercent += 0.1 * directionL;
        // xPercentR += 0.1 * directionR;
    }
    return (
        <div className="mt-20">
            <div className='flex whitespace-nowrap'>  
                <p className="text-7xl text-secondary" ref={firstLText}>Backend Frontend Mobile Web Game Web3 Artificial Intelligence&nbsp;</p>
                <p className="text-7xl text-secondary" ref={secondLText}>Backend Frontend Mobile Web Game Web3 Artificial Intelligence </p>
                {/* <p className="text-7xl text-secondary" ref={firstRText}>Software Engineering DevOps Scrum </p>
                <p className="text-7xl text-secondary" ref={secondRText}>Software Engineering DevOps Scrum </p> */}
            </div>
            
        </div>
    )
}
