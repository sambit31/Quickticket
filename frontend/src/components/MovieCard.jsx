import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock3, StarIcon } from 'lucide-react'
import TimeFormat from '../lib/TimeFormat'
import { useAppContext } from '../context/AppContext'

const MovieCard = ({ movie }) => {

  const navigate = useNavigate()
  const {image_base_url}=useAppContext()

  return (
    <div className='group bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>

      {/* Movie Image */}
      <div className='overflow-hidden relative'>

        <img
          onClick={() => {
            navigate(`/movies/${movie._id}`)
            window.scrollTo(0,0)
          }}
          src={image_base_url + movie.backdrop_path}
          alt={movie.title}
          className='h-56 w-full object-cover cursor-pointer transition duration-500 group-hover:scale-110'
        />

        {/* Rating Badge */}
        <div className='absolute top-3 right-3 bg-black/70 px-2 py-1 rounded-full flex items-center gap-1 text-xs'>

          <StarIcon
            className='w-4 h-4 text-yellow-400 fill-yellow-400'
          />

          <span>
            {movie.vote_average.toFixed(1)}
          </span>

        </div>

      </div>

      {/* Content */}
      <div className='p-4'>

        <h2 className='font-semibold text-lg text-white truncate'>
          {movie.title}
        </h2>

        <p className='text-gray-400 text-sm mt-2'>
          {new Date(movie.release_date).getFullYear()}
          {" • "}
          {
            movie.genres
            .slice(0,2)
            .map((genre)=>genre.name)
            .join(" | ")
          }
        </p>

        <div className='flex items-center gap-2 mt-3 text-gray-400 text-sm'>
          <Clock3 size={16}/>
          <span>{TimeFormat(movie.runtime)}</span>
        </div>

        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`)
            window.scrollTo(0,0)
          }}
          className='w-full mt-5 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 transition duration-300 font-medium'
        >
          Buy Tickets
        </button>

      </div>

    </div>
  )
}

export default MovieCard
