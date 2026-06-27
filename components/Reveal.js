"use client"
import React from 'react'
import {motion, useInView, useAnimation} from "framer-motion"
import { useEffect, useRef } from 'react'
export default function Reveal({children}) {
    const ref = useRef(null)
    const isInView = useInView(ref,{once:false})
    const controls = useAnimation()
    useEffect(()=>{
        if (isInView){
            controls.start("visible")
        }
    },[controls, isInView])
  return (
    <div ref={ref} className='relative w-full overflow-hidden'>
<motion.div variants={{hidden:{opacity:0, y: 75}, visible:{opacity:1, y:0}}} initial="hidden" animate={controls} transition={{duration:0.6,delay:0.3}}>
        {children}
    </motion.div>
    </div>
    
  )
}
