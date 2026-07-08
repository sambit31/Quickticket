import React, { useState } from "react";
import BlurCircle from "./BlurCircle";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { dummyDateTimeData } from "../assets/assets";

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const dates = Object.keys(dateTime);

  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) {
      toast.error("Please select a date.");
      return;
    }

    navigate(`/movies/${id}/${selected}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      id={id}
      className="relative w-full max-w-md rounded-3xl border border-gray-700 bg-gray-900/90 backdrop-blur-xl p-6 overflow-hidden"
    >
      <BlurCircle top="-120px" left="-120px" />
      <BlurCircle bottom="-120px" right="-120px" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 text-center">
        <ChevronLeft className="w-10 h-10 cursor-pointer text-gray-400 hover:text-pink-500 transition" />

        <h2 className="text-lg font-semibold text-white">
          Choose Date
        </h2>

        <ChevronRight className="w-10 h-10 cursor-pointer text-gray-400 hover:text-pink-500 transition" />
      </div>

      {/* Date Buttons */}
     <div className="flex flex-wrap gap-3">
  {dates.map((date) => (
    <button
      key={date}
      onClick={() => setSelected(date)}
      className={`px-4 py-3 rounded-xl transition ${
        selected === date
          ? "bg-pink-600 text-white"
          : "bg-gray-800 hover:bg-pink-600"
      }`}
    >
      {new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}
    </button>
  ))}
</div>

      {/* Selected Date */}
      {selected && (
        <div className="mt-5 rounded-xl border border-gray-700 bg-gray-800 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Selected Date
          </p>

          <p className="mt-1 font-semibold text-pink-500">
            {new Date(selected).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={onBookHandler}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-600/40 active:scale-95"
      >
        Book Now
      </button>
    </div>
  );
};

export default DateSelect;