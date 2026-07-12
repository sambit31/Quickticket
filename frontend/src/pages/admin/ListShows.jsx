import React, { useEffect, useState } from "react";
import { dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/Loading";
import { StarIcon, Trash2Icon } from "lucide-react";
import { dateFormat } from "../../lib/dateFormat";
import BlurCircle from "../../components/BlurCircle";

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setShows(dummyDashboardData.activeShows);
    setLoading(false);
  }, []);

  const deleteShow = (id) => {
    setShows(shows.filter((show) => show._id !== id));
  };

  if (loading) return <Loading />;

  return (
    <div className="text-white">
                  <BlurCircle top='-0px' />
            <BlurCircle right='20px'bottom='-100px'/>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Active <span className="text-pink-500">Shows</span>
        </h1>

        <p className="text-gray-400 mt-2">
          Manage all scheduled movie shows.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

        {shows.map((show) => (

          <div
            key={show._id}
            className="bg-[#171717] rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300"
          >

            {/* Poster */}

            <img
              src={show.movie.poster_path}
              alt={show.movie.title}
              className="w-full h-72 object-cover"
            />

            {/* Details */}

            <div className="p-5">

              <div className="flex justify-between items-center">

                <h2 className="font-semibold text-lg truncate">
                  {show.movie.title}
                </h2>

                <div className="flex items-center gap-1">

                  <StarIcon className="w-4 h-4 fill-pink-500 text-pink-500" />

                  <span className="text-sm">
                    {show.movie.vote_average.toFixed(1)}
                  </span>

                </div>

              </div>

              <p className="text-sm text-gray-400 mt-2">
                {show.movie.runtime} mins
              </p>

              <p className="text-gray-400 mt-3">
                {dateFormat(show.showDateTime)}
              </p>

              <div className="flex justify-between items-center mt-5">

                <span className="text-pink-500 font-bold text-lg">
                  {currency}
                  {show.showPrice}
                </span>

                <button
                  onClick={() => deleteShow(show._id)}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition"
                >
                  <Trash2Icon size={18} />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ListShows;