import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../../assets/assets";
import Loading from "../../components/Loading";
import { CheckCircle, Clock3 } from "lucide-react";
import { dateFormat } from "../../lib/dateFormat";
import BlurCircle from "../../components/BlurCircle";
import { useAppContext } from "../../context/AppContext";

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const { axios, getToken, user, image_base_url } = useAppContext();
 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const getAllBookings = async()=>{
   try {
      const {data} = await axios.get("/api/admin/all-bookings",{
         headers:{
                Authorization: `Bearer ${await getToken()}`
              }
            })
            setBookings(data.bookings)
    } catch (error) {
      console.log(error);
    }
     setLoading(false);
  };
  
  useEffect(() => {
    if(user){
      getAllBookings();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="text-white">
                  <BlurCircle top='-0px' />
            <BlurCircle right='20px'bottom='-100px'/>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Booking <span className="text-pink-500">Management</span>
        </h1>

        <p className="text-gray-400 mt-2">
          View and manage all movie bookings.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#18181b] rounded-2xl border border-white/10">

        <table className="w-full">

          <thead className="bg-[#242424] text-gray-300">
            <tr>
              <th className="px-6 py-4 text-left">Movie</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Seats</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Show Time</th>
            </tr>
          </thead>

          <tbody>

            {bookings.map((booking) => (

              <tr
                key={booking._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                {/* Movie */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">

                    <img
                      src={booking.show.movie.poster_path}
                      alt={booking.show.movie.title}
                      className="w-14 h-20 rounded-lg object-cover"
                    />

                    <div>
                      <p className="font-semibold">
                        {booking.show.movie.title}
                      </p>

                      <p className="text-sm text-gray-400">
                        {booking.show.movie.runtime} mins
                      </p>
                    </div>

                  </div>
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  {booking.user.name}
                </td>

                {/* Seats */}
                <td className="px-6 py-4">
                  {booking.bookedSeats.join(", ")}
                </td>

                {/* Amount */}
                <td className="px-6 py-4 font-semibold text-pink-500">
                  {currency}
                  {booking.amount}
                </td>

                {/* Payment */}
                <td className="px-6 py-4">

                  {booking.isPaid ? (
                    <span className="flex items-center gap-2 text-green-400">
                      <CheckCircle size={18} />
                      Paid
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-yellow-400">
                      <Clock3 size={18} />
                      Pending
                    </span>
                  )}

                </td>

                {/* Date */}
                <td className="px-6 py-4 text-gray-300">
                  {dateFormat(booking.show.showDateTime)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default ListBookings;