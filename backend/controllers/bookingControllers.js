import { Booking } from "../models/Booking.js";
import { Show } from "../models/Show.js";
import Stripe from "stripe"


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
      status: "pending",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // Mark seats as occupied
    selectedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    // Tell Mongoose occupiedSeats has changed
    showData.markModified("occupiedSeats");

    await showData.save();


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create line items
const line_items = [
  {
    price_data: {
      currency: "usd",
      product_data: {
        name: showData.movie.title,
      },
      unit_amount: Math.floor(booking.amount * 100),
    },
    quantity: 1,
  },
];

const session = await stripeInstance.checkout.sessions.create({
  success_url: `${origin}/loading/my-bookings`,
  cancel_url: `${origin}/payment-cancel/${booking._id}`,
  line_items,
  mode: "payment",
  metadata: {
    bookingId: booking._id.toString(),
  },
  expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
});

booking.paymentLink = session.url;
await booking.save();

res.json({
  success: true,
  url: session.url,
});

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

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ Don't allow cancelling a paid booking
    if (booking.isPaid || booking.status === "paid") {
      return res.json({
        success: false,
        message: "Booking already paid",
      });
    }

    const show = await Show.findById(booking.show);

    booking.bookedSeats.forEach((seat) => {
      delete show.occupiedSeats[seat];
    });

    show.markModified("occupiedSeats");
    await show.save();

    await Booking.findByIdAndDelete(bookingId);

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};