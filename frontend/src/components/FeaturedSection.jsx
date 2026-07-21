import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { dummyShowsData } from '../assets/assets'
import { useAppContext } from '../context/AppContext'


const FeaturedSection = () => {
    const navigate = useNavigate()
    const {shows} = useAppContext()
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>

        <div className='relative flex items-center justify-between pt-20 pb-10'>
          <BlurCircle top='0' right='-80px'/>
            <p className="text-lg font-medium text-gray-300">Now Showing</p>
            <button onClick={()=>navigate('/movies')} className="group flex items-center gap-2 text-sm text-gray-300">View All<ArrowRight className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" /></button>
        </div>

       <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10'>
  {shows.slice(0, 5).map((show) => (
    <MovieCard
      key={show._id}
      movie={show.movie}
    />
  ))}
</div>

        <div className='flex justify-center mt-20'>
          <button onClick={()=>{navigate('/movies'); window.scrollTo(0, 0)}} className='px-6 py-3 bg-pink-600 hover:opacity-90 transition rounded-full font-medium cursor-pointer'>Show more</button>
        </div>
    </div>
  )
}

export default FeaturedSection