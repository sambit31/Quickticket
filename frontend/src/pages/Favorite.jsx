import React from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const Favorite = () => {

  return dummyShowsData.length > 0 ? (

    <div className='relative px-6 md:px-16 lg:px-24 xl:px-44 py-24 min-h-screen overflow-hidden'>

      <BlurCircle top='-100px' left='-100px' />
      <BlurCircle right='-40px' bottom='70px' />

      {/* Heading */}
      <div className='mb-12 text-center'>

        <h1 className='text-4xl font-bold'>
          My Favorites
        </h1>

        <p className='text-gray-400 mt-3'>
          Your saved movies collection
        </p>

      </div>

      {/* Movies Grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>

        {dummyShowsData.map((movie) => ( <MovieCard key={movie._id} movie={movie}/>))}

      </div>

    </div>

  ) : (

    <div className='flex flex-col items-center justify-center min-h-screen'>

      <h1 className='text-2xl font-semibold text-gray-400'>
        No Favorite Movies Yet
      </h1>

      <p className='text-gray-500 mt-2'>
        Start adding movies to your favorites
      </p>

    </div>

  )
}

export default Favorite