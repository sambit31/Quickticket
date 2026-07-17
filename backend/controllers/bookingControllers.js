import { Booking } from "../models/Booking.js";
import { Show } from "../models/Show.js";


const CheckSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);

    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some(
      seat => occupiedSeats[seat]
    );

    return !isAnySeatTaken;

  } catch (error) {
    console.log(error.message);
    return false;
  }
};


export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    // Check if seats are available
    const isAvailable = await CheckSeatsAvailability(showId, selectedSeats);

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected seats are not available",
      });
    }

    // Get show details
    const showData = await Show.findById(showId).populate("movie");

    if (!showData) {
      return res.json({
        success: false,
        message: "Show not found",
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    // Mark seats as occupied
    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    // Tell Mongoose occupiedSeats has changed
    showData.markModified("occupiedSeats");

    await showData.save();

    // TODO: Stripe Payment Gateway

    res.json({success: true, message: "Booked Successfully",booking});
  } catch (error) {
    console.error(error);

    res.status(500).json({success: false, message: error.message});
  }
};


export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    const showData = await Show.findById(showId);

    if (!showData) {
      return res.status(404).json({success: false, message: "Show not found"});
    }

    const occupiedSeats = Object.keys(showData.occupiedSeats);
    res.json({success: true, occupiedSeats});

  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: error.message});
  }
};