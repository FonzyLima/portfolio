import React from 'react'
import Navigation from '../../../components/Navigation'
import SlidingText from '../../../components/SlidingText'
export default function about() {
  return (
    <div className="bg-primary">
        <Navigation/>
        <div>

        </div>
        <div className="mt-40 space-y-0">
          <SlidingText text="Backend Frontend Mobile Web Game Web3 Artificial Intelligence&nbsp;" direction={-1}/>
          <SlidingText text="ReactJS NextJS NodeJS Python Java C# C++ Solidity SQL&nbsp;" direction={1}/>
        </div>
    </div>
  )
}
