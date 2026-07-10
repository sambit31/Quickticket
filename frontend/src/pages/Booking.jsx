import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import TimeFormat from "../lib/TimeFormat";
import { dateFormat } from "../lib/dateFormat";

const Booking = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-32 xl:px-44 pt-28 min-h-screen text-white">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle top="0px" left="700px" />

      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="space-y-6">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.01] transition-all duration-300"
          >
            {/* Movie Poster */}
            <img
              src={item.show.movie.poster_path}
              alt={item.show.movie.title}
              className="w-full md:w-52 h-72 object-cover"
            />

            {/* Details */}
            <div className="flex flex-col flex-1 p-6">
              <h2 className="text-2xl font-semibold">
                {item.show.movie.title}
              </h2>

              <p className="text-gray-400 mt-2">
                🎬 {item.show.movie.runtime} mins
              </p>

              <p className="text-gray-400 mt-2">
                📅 {dateFormat(item.show.showDateTime)}
              </p>

              <p className="text-gray-400 mt-2">
                🕒 {TimeFormat(item.show.movie.runtime)}
              </p>

              <p className="text-gray-400 mt-2">
                💺 Seats: {item.bookedSeats.join(", ")}
              </p>

              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="text-pink-500 text-xl font-bold">
                  {currency}
                  {item.amount}
                </span>

                <button className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition">
                  View Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default Booking