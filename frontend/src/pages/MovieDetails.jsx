import React, { useEffect, useState } from "react";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { CalendarDays, Clock3, StarIcon } from "lucide-react";

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  const getShow = () => {
    const movie = dummyShowsData.find((item) => item._id === id);

    if (!movie) return;

    setShow({
      movie,
      dateTime: dummyDateTimeData,
    });
  };

  useEffect(() => {
    getShow();
  }, [id]);

  if (!show)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden top-15">

      {/* Backdrop */}
     <div className="absolute inset-0">
  <img
    src={show.movie.backdrop_path}
    alt=""
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/70" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/80 to-[#09090B]" />
</div>

      <BlurCircle top="-60px" left="-120px" />
      <BlurCircle bottom="-100px" right="-80px" />

      <div className="relative px-6 md:px-16 lg:px-24 xl:px-44 py-20">

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

          {/* Poster */}
          <div className="flex justify-center ">
            <img
              src={show.movie.poster_path}
              alt={show.movie.title}
              className="w-72 rounded-3xl shadow-2xl transition duration-500 hover:scale-105"
            />
          </div>

          {/* Details */}
          <div className="flex-1">

            <span className="inline-block px-4 py-1 rounded-full bg-pink-600/20 border border-pink-500 text-pink-400 text-sm font-medium">
              English
            </span>

            <h1 className="text-5xl font-bold mt-5 leading-tight">
              {show.movie.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-6">

              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2">

                <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />

                <span className="font-semibold">
                  {show.movie.vote_average.toFixed(1)}
                </span>

              </div>

              <span className="text-gray-400">
                User Rating
              </span>

            </div>

            {/* Movie Info */}
            <div className="flex flex-wrap gap-6 mt-8 text-gray-300">

              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-pink-500" />
                {new Date(show.movie.release_date).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="w-5 h-5 text-pink-500" />
                {show.movie.runtime} mins
              </div>

            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-3 mt-8">

              {show.movie.genres.map((genre) => (

                <span
                  key={genre.id}
                  className="px-4 py-2 rounded-full border border-gray-700 bg-white/5 backdrop-blur text-sm hover:border-pink-500 transition"
                >
                  {genre.name}
                </span>

              ))}

            </div>

            {/* Description */}
            <p className="text-gray-400 leading-8 mt-8 max-w-3xl">
              {show.movie.overview}
            </p>

            {/* Button */}
            <button className="mt-10 px-8 py-4 rounded-xl bg-pink-600 hover:bg-pink-700 transition font-semibold shadow-lg shadow-pink-600/30">
              Book Tickets
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default MovieDetails;