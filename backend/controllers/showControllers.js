import axios from "axios";
import { Movie } from "../models/Movie.js";
import { Show } from "../models/Show.js";

// =======================
// Get Now Playing Movies
// =======================
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        
      }
    );
    
    res.status(200).json({
      success: true,
      movies: data.results,
    });
  }catch (error) {
    console.log("MESSAGE:", error.message);
    console.log("CODE:", error.code);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("CAUSE:", error.cause);

    return res.status(500).json({
        success:false,
        message:error.message
    });
}
}

// =======================
// Add Movie Shows
// =======================
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    console.log(req.body);
    // Check if movie already exists
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie details & credits together
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
          }
        ),

        axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
          }
        ),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path || "",
        backdrop_path: movieApiData.backdrop_path || "",
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        genres: movieApiData.genres,
        casts: movieCreditsData.cast || [],
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      // Upsert avoids duplicate key errors
      movie = await Movie.findByIdAndUpdate(
        movieId,
        movieDetails,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    // Create Show documents
    const showsToCreate = [];

    showsInput.forEach((show) => {
      show.time.forEach((time) => {
        const dateTimeString = `${show.date}T${time}`;

        showsToCreate.push({
          movie: movie._id,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    return res.status(201).json({
      success: true,
      message: "Shows added successfully.",
    });

  } catch (error) {
    console.error("Add Show Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.status_message || error.message,
    });
  }
};


// API to get all upcoming shows
export const getManyShows = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie")
      .sort({ showDateTime: 1 });

    // Filter unique movies
    const uniqueShows = [
      ...new Map(
        shows.map((show) => [show.movie._id.toString(), show])
      ).values(),
    ];

    res.json({success: true, shows: uniqueShows,});
  } catch (error) {
    console.error(error);
    res.json({success: false, message: error.message});
  }
};


// API to get a single movie's upcoming shows
export const getOneShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    
    // Get all upcoming shows of this movie
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    }).sort({ showDateTime: 1 });

    const movie = await Movie.findById(movieId);
  
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });
  

    res.json({success: true, movie, dateTime});
  } catch (error) {
    console.error(error);
    res.json({success: false, message: error.message});
  }
};