import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { StarIcon, CheckIcon } from "lucide-react";
import BlurCircle from "../../components/BlurCircle";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {

  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPrice, setShowPrice] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [dateTimeSelection, setDateTimeSelection] = useState({});

  const [addingShow, setAddingShow] = useState(false)

const fetchNowPlayingMovies = async () => {
  try {
    const token = await getToken();
    

    const { data } = await axios.get("/api/show/now-playing", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API Response:", data);

    if (data.success) {
      setNowPlayingMovies(data.movies);
    }
  } catch (error) {
    console.error(error.response?.data || error);
  }
};




const handleSubmit = async () => {
  try {
    setAddingShow(true);

    if (
      !selectedMovie ||
      !showPrice ||
      Object.keys(dateTimeSelection).length === 0
    ) {
      toast.error("Missing required fields");
      return;
    }

    const showsInput = Object.entries(dateTimeSelection).map(
      ([date, time]) => ({
        date,
        time,
      })
    );

    const payload = {
      movieId: selectedMovie.id,
      showsInput,
      showPrice: Number(showPrice),
    };

    const { data } = await axios.post(
      "/api/show/add",
      payload,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);

      setSelectedMovie(null);
      setDateTimeSelection({});
      setShowPrice("");
      setSelectedDate("");
      setSelectedTime("");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to add show");
  } finally {
    setAddingShow(false);
  }
};



  useEffect(() => {
    if(user){
      fetchNowPlayingMovies();
    }

  }, [user])

  const addTime = () => {
    if (!selectedDate || !selectedTime) return;

    setDateTimeSelection((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), selectedTime],
    }));

    setSelectedTime("");
  };

  const removeTime = (date, index) => {
    const updated = { ...dateTimeSelection };

    updated[date].splice(index, 1);

    if (updated[date].length === 0) delete updated[date];

    setDateTimeSelection(updated);
  };

  //if (nowPlayingMovies.length === 0) return <Loading />;

  return (
    <div className="text-white">
      <BlurCircle top='-0px' />
      <BlurCircle right='20px' bottom='-100px' />

      {/* Heading */}

      <h1 className="text-3xl font-bold mb-8">
        Add <span className="text-pink-500">Shows</span>
      </h1>

      {/* Movies */}

      <h2 className="text-xl font-semibold mb-5">
        Now Playing Movies
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6 object-cover">


        {nowPlayingMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            className={`relative cursor-pointer rounded-xl overflow-hidden border transition-all duration-300
            ${selectedMovie?.id === movie.id
                ? "border-pink-500 ring-2 ring-pink-500"
                : "border-white/10 hover:border-pink-500"
              }`}
          >
            {/* Poster */}

            <img
              src={image_base_url + movie.poster_path}
              alt={movie.title}
              className="aspect-[2/3] w-full object-cover rounded-lg"
            />

            {/* Tick */}

            <div className="absolute top-3 right-3">

              {selectedMovie?.id === movie.id ? (
                <div className="bg-pink-500 rounded-md p-1">
                  <CheckIcon size={16} />
                </div>
              ) : (
                <div className="border border-white rounded-md w-5 h-5"></div>
              )}

            </div>

            {/* Bottom */}

            <div className="bg-[#151515] p-3">

              <div className="flex items-center gap-2 text-sm">

                <StarIcon
                  className="w-4 h-4 text-pink-500 fill-pink-500"
                />

                <span>{movie.vote_average.toFixed(1)}</span>

                <span className="text-gray-400">
                  {movie.vote_count} Votes
                </span>

              </div>

              <h3 className="mt-3 font-semibold">
                {movie.title}
              </h3>

              <p className="text-sm text-gray-400 truncate">
                {movie.genres?.join(", ")}
              </p>

            </div>
          </div>
        ))}
      </div>

      {/* Form */}

      <div className="mt-12 max-w-md space-y-6">

        {/* Price */}

        <div>
          <label className="block mb-2 font-medium">
            Show Price
          </label>

          <input
            type="number"
            placeholder="Enter show price"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-pink-500"
          />
        </div>

        {/* Date */}

        <div>
          <label className="block mb-2 font-medium">
            Select Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-pink-500"
          />
        </div>

        {/* Time */}

        <div>

          <label className="block mb-2 font-medium">
            Select Time
          </label>

          <div className="flex gap-3">

            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="flex-1 bg-[#181818] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-pink-500"
            />

            <button
              onClick={addTime}
              className="bg-pink-600 hover:bg-pink-700 px-5 rounded-lg"
            >
              Add Time
            </button>

          </div>
        </div>

        {/* Selected */}

        <div>

          <h3 className="font-semibold mb-3">
            Selected Date-Time
          </h3>

          {Object.keys(dateTimeSelection).map((date) => (
            <div key={date} className="mb-4">

              <p className="text-gray-300 mb-2">{date}</p>

              <div className="flex flex-wrap gap-2">

                {dateTimeSelection[date].map((time, index) => (
                  <div
                    key={index}
                    className="bg-pink-600 px-3 py-2 rounded-md flex items-center gap-2"
                  >
                    {time}

                    <button
                      onClick={() => removeTime(date, index)}
                    >
                      ✕
                    </button>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>

        <button onClick={handleSubmit} disabled={addingShow} className="bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-lg font-semibold">
          Add Show
        </button>

      </div>

    </div>
  );
};

export default AddShows;