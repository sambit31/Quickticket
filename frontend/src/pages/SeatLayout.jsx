import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { ClockIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import isoTimeFormat from "../lib/isoTimeFormat";
import { useAppContext } from "../context/AppContext";

const MAX_SEATS = 5;

const SeatLayout = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();

  const { axios, getToken } = useAppContext();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedTime, setSelectedTime] = useState(null);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const seatSections = [
    {
      id: "front",
      rows: [
        { left: "A" },
        { left: "B" },
      ],
    },
    {
      id: "mid",
      rows: [
        { left: "C", right: "E" },
        { left: "D", right: "F" },
      ],
    },
    {
      id: "back",
      rows: [
        { left: "G", right: "I" },
        { left: "H", right: "J" },
      ],
    },
  ];


  const getShow = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/show/${id}`);

      if (data.success) {
        setShow(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load show");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getShow();
    }
  }, [id]);


  const getOccupiedSeats = async (showId) => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${showId}`);

      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load occupied seats");
    }
  };

  useEffect(() => {
    if (selectedTime?.showId) {
      getOccupiedSeats(selectedTime.showId);
      setSelectedSeats([]);
    }
  }, [selectedTime]);



  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Please select a show time");
    }

    if (occupiedSeats.includes(seatId)) {
      return;
    }

    if (
      !selectedSeats.includes(seatId) &&
      selectedSeats.length >= MAX_SEATS
    ) {
      return toast.error(`Maximum ${MAX_SEATS} seats allowed`);
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const createBooking = async () => {
    try {
      if (!selectedTime) {
        return toast.error("Please select a show time");
      }

      if (selectedSeats.length === 0) {
        return toast.error("Please select seats");
      }

      const { data } = await axios.post(
        "/api/booking/create",
        {
          showId: selectedTime.showId,
          selectedSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };


  const renderSeat = (row, num) => {
    const seatId = `${row}${num}`;

    const booked = occupiedSeats.includes(seatId);
    const selected = selectedSeats.includes(seatId);

    return (
      <button
        key={seatId}
        disabled={booked}
        onClick={() => handleSeatClick(seatId)}
        className={`h-8 w-8 rounded-md border text-xs transition
      ${booked
            ? "bg-gray-700 border-gray-700 text-gray-500 cursor-not-allowed"
            : selected
              ? "bg-pink-600 border-pink-600 text-white"
              : "border-pink-500 hover:bg-pink-500/20"
          }`}
      >
        {num}
      </button>
    );
  };


  const renderRow = (row) => (
    <div className="w-6 flex items-center justify-center text-xs font-semibold">
      {row}
    </div>
  );

  if (loading) return <Loading />;

  if (!show) return <p className="text-center mt-20">Show not found</p>;

  return (
    <div className="min-h-screen text-white px-10 py-10">
      <div className="flex flex-col md:flex-row gap-10 py-10">

        {/* Time Selection */}
        <div className="w-64 h-fit bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:sticky md:top-6">

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                Available Timings
              </h2>
              <p className="text-xs text-gray-400">
                Select your preferred show
              </p>
            </div>

            <ClockIcon className="text-pink-500" />
          </div>

          <div className="h-px bg-white/10 my-5"></div>

          <div className="space-y-3">

            {(show.dateTime?.[date] || []).map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(item)}
                className={`w-full px-4 py-3 rounded-xl text-left transition
                ${selectedTime?.showId === item.showId
                    ? "bg-pink-600"
                    : "bg-white/5 hover:bg-white/10"
                  }`}
              >
                {isoTimeFormat(item.time)}
              </button>
            ))}

          </div>
        </div>

        {/* Seat Layout */}
        <div className="flex-1 flex flex-col items-center relative py-20">

          <BlurCircle top="-100px" left="-100px" />
          <BlurCircle bottom="0" right="0" />

          <img
            src={assets.screenImage}
            className="w-full max-w-xl"
            alt="screen"
          />

          <p className="my-6 uppercase tracking-widest text-xs">
            Screen Side
          </p>

          <div className="space-y-8">
            {seatSections.map((section) => (
              <div key={section.id} className="space-y-2">
                {section.rows.map((pair, idx) => (
                  <div
                    key={idx}
                    className="flex justify-center gap-8"
                  >
                    <div className="flex items-center gap-2">
                      {renderRow(pair.left)}

                      <div className="flex gap-2">
                        {Array.from({ length: 9 }, (_, i) =>
                          renderSeat(pair.left, i + 1)
                        )}
                      </div>
                    </div>

                    {pair.right && (
                      <div className="flex items-center gap-2">
                        {renderRow(pair.right)}

                        <div className="flex gap-2">
                          {Array.from({ length: 9 }, (_, i) =>
                            renderSeat(pair.right, i + 1)
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {selectedSeats.length > 0 && (
            <button
              onClick={createBooking}
              className="mt-10 bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-lg"
            >
              Book {selectedSeats.length} Seat
              {selectedSeats.length > 1 ? "s" : ""}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default SeatLayout;