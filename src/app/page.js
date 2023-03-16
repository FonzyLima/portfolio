import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Navigation from '../../components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="bg-primary">
      <Navigation/>
      <div className="flex flex-col text-center pt-[60px] items-center">
        <div className="text-tertiary text-[22px]">Hi there! &#128075; I am</div>
        <div className="text-secondary text-[90px]">Fonzy Lima</div>
        <div className="text-secondary text-[90px]">Software Developer</div>
        <div className="text-tertiary text-[22px]">A Software Developer based in Manila, Philippines</div>
        <div className="p-3 mt-[30px] text-[22px] bg-[#7DF39D] w-[190px] h-[53px] text-center align-text-middle rounded-[10px] items-center">Get in touch</div>
      </div>
      
    </div>
  )
}
