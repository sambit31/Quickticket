import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player/youtube'
import BlurCircle from './BlurCircle'

const TrailersSection = () => {

    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden py-20'>

            {/* Heading */}
            <div className='mb-10'>
                <h1 className='text-3xl font-bold'>
                    Latest Trailers
                </h1>

                <p className='text-gray-400 mt-2'>
                    Watch trending and upcoming movie trailers
                </p>
            </div>

            <div className='relative flex flex-col lg:flex-row gap-8'>

                <BlurCircle top='-100px' left='-100px' />

                {/* Main Video */}
                <div className='flex-1 relative'>

                    <div className='relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-[0_0_40px_rgba(236,72,153,0.15)]'>

                        <ReactPlayer
                            url={currentTrailer?.videoUrl}
                            width="100%"
                            height="500px"
                            controls
                            playing={false}
                        />
                    </div>

                    <div className='mt-5'>
                        <h2 className='text-xl font-semibold'>
                            {currentTrailer.title}
                        </h2>

                        
                    </div>

                </div>

                {/* Sidebar Trailer List */}
                <div className='lg:w-80 flex lg:flex-col gap-5 overflow-x-auto lg:max-h-125 lg:overflow-y-auto pr-2'>

                    {dummyTrailers.map((trailer, index) => (

                        <div
                            key={index}
                            onClick={() => setCurrentTrailer(trailer)}
                            className={`
                                relative cursor-pointer rounded-2xl overflow-hidden
                                transition-all duration-300 min-w-62.5
                                ${currentTrailer.videoUrl === trailer.videoUrl
                                    ? "border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
                                    : "border border-transparent hover:border-pink-500/50"
                                }
              `}
                        >

                            <img
                                src={trailer.image}
                                alt=""
                                className='h-36 w-full object-cover'
                            />

                            <div className='absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent' />

                            <div className='absolute bottom-3 left-3'>
                                <p className='font-semibold text-sm'>
                                    {trailer.title}
                                </p>

                                <p className='text-xs text-gray-300'>
                                    Trailer {index + 1}
                                </p>
                            </div>

                            <div className='absolute top-3 right-3 h-10 w-10 rounded-full bg-black/60 flex items-center justify-center'>
                                ▶
                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}

export default TrailersSection