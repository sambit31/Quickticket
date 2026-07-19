import { clerkClient } from "@clerk/express";
import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";
import { Movie } from "../models/Movie.js";

export const syncUser = async (req, res) => {
  try {
    const { id, firstName, lastName, email, image } = req.body;

    const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "User";


    let user = await User.findById(id);

    if (user) {
      user.name = fullName;
      user.email = email;
      user.image = image;

      await user.save();

      return res.json({
        success: true,
        message: "User Updated",
      });
    }

    user = await User.create({
      _id: id,
      name: fullName,
      email,
      image,
    });

    res.json({
      success: true,
      message: "User Created",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;
    const bookings = await Booking.find({ user }).populate({
      path: 'show',
      populate: { path: "movie" }
    }).sort({ createdAt: -1 })
    res.json({ success: true, bookings })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}




export const updateFavourite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    // Get current user
    const user = await clerkClient.users.getUser(userId);

    // Get favourites or create an empty array
    let favourites = user.privateMetadata.favourites || [];

    // Toggle favourite
    if (!favourites.includes(movieId)) {
      favourites.push(movieId);
    } else {
      favourites = favourites.filter(item => item !== movieId);
    }

    // Save updated favourites
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        favourites,
      },
    });

    res.json({
      success: true,
      message: "Favourite updated successfully",
      favourites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getFavourites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);

    // Get favourites from Clerk metadata
    const favourites = user.privateMetadata.favourites || [];

    // Find all movies whose _id exists in favourites array
    const movies = await Movie.find({
      _id: { $in: favourites },
    });

    res.json({
      success: true,
      movies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};