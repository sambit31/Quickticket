import { ArrowRight, CalendarRangeIcon, ClockIcon } from 'lucide-react'
import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url('/backgroundImage.png')] bg-cover bg-center min-h-screen">
      <img src={assets.marvelLogo} alt="Logo" className="max-w-30 lg:h-20 mt-20" />

      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">Guardians <br /> of the Galaxy <br /> </h1>

      <div className="flex items-center text-gray-300 gap-4">

        <span>Action | Adventure | Sci-Fi</span>

        <div className = "flex items-center gap-1">
            <CalendarRangeIcon className="w-4.5 h-4.5" />2026
        </div>

         <div className = "flex items-center gap-1">
            <ClockIcon className="w-4.5 h-4.5" />2h 8m
        </div>

      </div>
      <p className="text-gray-300 max-w-md">In a post-apocalyptic future, Earth has been devastated by a catastrophic event. A group of unlikely heroes must band together to save what remains.</p>

      <button onClick={() => navigate('/movies')} className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:opacity-90 transition rounded-full font-medium cursor-pointer">Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default HeroSection