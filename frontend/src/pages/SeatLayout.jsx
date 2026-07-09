import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loading from "../components/Loading";
import MyBooking from "../pages/MyBooking"
import BlurCircle from "../components/BlurCircle";
import { ClockIcon, ArmchairIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import isoTimeFormat from "../lib/isoTimeFormat";

// TODO: replace with occupied seats returned by your booking API for this show/time
const dummyOccupiedSeats = ["A3", "A4", "C5", "D5", "G7", "H2"];

const MAX_SEATS = 5;

const SeatLayout = () => {
  // Each "line" pairs two row-blocks side by side (like a real auditorium
  // split by a centre aisle). The first line (A/B) spans the full width.
  const seatSections = [
    { id: "front", rows: [{ left: "A" }, { left: "B" }] },
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

  const { id, date } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  useEffect(() => {
    const movieShow = dummyShowsData.find((s) => s.id === parseInt(id));
    if (movieShow) {
      setShow({
        movie: movieShow,
        dateTime: dummyDateTimeData,
      });
    }
  }, [id]);

  const price = show?.movie?.price || 220;
  const total = selectedSeats.length * price;

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please select a showtime first");
    }
    if (dummyOccupiedSeats.includes(seatId)) return;

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= MAX_SEATS) {
      return toast(`You can only select up to ${MAX_SEATS} seats`);
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeat = (row, num) => {
    const seatId = `${row}${num}`;
    const isBooked = dummyOccupiedSeats.includes(seatId);
    const isSelected = selectedSeats.includes(seatId);

    return (
      <button
        key={seatId}
        disabled={isBooked}
        onClick={() => handleSeatClick(seatId)}
        className={`h-8 w-8 rounded-md border text-xs font-medium transition
      ${isBooked
            ? "bg-gray-700 border-gray-700 cursor-not-allowed text-gray-500"
            : isSelected
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

  return show ? (
    <div className="min-h-screen text-white px-10 py-10">
      <div className="flex flex-col md:flex-row gap-10 py-10">

        {/* Left Timing Box */}
       {/* Left Timing Box */}
<div className="w-64 h-fit bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl md:sticky md:top-6">

  {/* Header */}
  <div className="flex items-center justify-between ">
    <div>
      <h2 className="text-xl font-bold text-white ">
        Available Timings
      </h2>
      <p className="text-xs text-gray-400 mt-1">
        Select your preferred show
      </p>
    </div>

    <div className="h-10 w-10 rounded-full bg-pink-600/20 flex items-center justify-center">
      <ClockIcon className="w-5 h-5 text-pink-500" />
    </div>
  </div>

  {/* Divider */}
  <div className="h-px bg-white/10 my-5"></div>

  {/* Timings */}
  <div className="space-y-3">
    {show.dateTime[date]?.map((item, index) => (
      <button
        key={index}
        onClick={() => setSelectedTime(item)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          selectedTime?.time === item.time
            ? "bg-gradient-to-r from-pink-600 to-pink-700 shadow-lg shadow-pink-500/30 text-white"
            : "bg-white/5 hover:bg-white/10 text-gray-300"
        }`}
      >
        <ClockIcon
          className={`w-4 h-4 ${
            selectedTime?.time === item.time
              ? "text-white"
              : "text-pink-400"
          }`}
        />

        <span className="text-sm font-medium">
          {isoTimeFormat(item.time)}
        </span>

        {selectedTime?.time === item.time && (
          <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
        )}
      </button>
    ))}
  </div>

</div>

        {/* Seat Layout */}
        <div className="relative flex-1 flex flex-col items-center py-40">

          <BlurCircle top="-100px" left="-100px" />
          <BlurCircle bottom="0" right="0" />

          <img
            src={assets.screenImage}
            alt="Screen"
            className="w-full max-w-xl"
          />

          <p className="mt-5 mb-8 text-xs uppercase tracking-widest">
            Screen Side
          </p>
          <div className="space-y-8">
            {seatSections.map((section) => (
              <div key={section.id} className="space-y-2">
                {section.rows.map((rowPair, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-8"
                  >
                    {/* Left Row */}
                    <div className="flex items-center gap-2">
                      {renderRow(rowPair.left)}

                      <div className="flex gap-2">
                        {Array.from({ length: 9 }, (_, i) =>
                          renderSeat(rowPair.left, i + 1)
                        )}
                      </div>
                    </div>

                    {/* Right Row */}
                    {rowPair.right && (
                      <div className="flex items-center gap-2">
                        {renderRow(rowPair.right)}

                        <div className="flex gap-2">
                          {Array.from({ length: 9 }, (_, i) =>
                            renderSeat(rowPair.right, i + 1)
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
              onClick={() => navigate("/MyBooking")}
              className="mt-10 bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-lg"
            >
              Proceed ({selectedSeats.length})
            </button>
          )}
        </div>

      </div>
    </div>
  ) : (
    <Loading />
  )
}
export default SeatLayout;