import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Navigation from '../../components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="bg-primary">
      <Navigation/>
      <div className="flex flex-col text-center pt-[60px]">
        <div className="text-tertiary text-[22px]">Hi there! I am</div>
        <div className="text-secondary text-[90px]">Fonzy Lima</div>
        <div className="text-secondary text-[90px]">Software Developer</div>
        <div className="text-tertiary text-[22px]">A Software Developer based in Manila, Philippines</div>
        <div>Get in touch</div>
      </div>
      
    </div>
  )
}
