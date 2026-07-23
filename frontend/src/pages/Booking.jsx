import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import TimeFormat from "../lib/TimeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";

const Booking = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getToken, user, image_base_url } = useAppContext()


  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/users/bookings", {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })

      if (data.success) {
        setBookings(data.bookings)
      }

    }
    catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }


  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, [user]);


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
              src={image_base_url + item.show.movie.poster_path}
              alt={item.show.movie.title}
              className="w-full md:w-52 h-72 object-cover"
            />

            {/* Movie Details */}
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
                🕒 {TimeFormat(item.show.showDateTime)}
              </p>

              <p className="text-gray-400 mt-2">
                💺 Seats: {item.bookedSeats.join(", ")}
              </p>

              <div className="mt-auto flex items-center justify-between pt-6">
                <div>
                  <p className="text-pink-500 text-xl font-bold">
                    {currency}
                    {item.amount}
                  </p>

                  <p className="text-sm text-gray-400">
                    Total Tickets: {item.bookedSeats.length}
                  </p>
                </div>
                <div className="flex items-center gap-3">

                  {item.status === "paid" && (
                    <span className="px-4 py-2 rounded-lg bg-green-600 text-sm font-medium">
                      Paid
                    </span>
                  )}

                  {item.status === "pending" && (
                    <a
                      href={item.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-600 hover:bg-pink-700 px-5 py-2 rounded-lg font-medium transition"
                    >
                      Pay Now
                    </a>
                  )}

                  {item.status === "cancelled" && (
                    <span className="px-4 py-2 rounded-lg text-red-500 text-sm font-medium">
                      Cancelled
                    </span>
                  )}

                </div>
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