import { Booking } from "../models/Booking.js";
import { Show } from "../models/Show.js";
import { generateTicket } from "../utils/generatePDF.js";
import dateFormat from "../utils/dateFormat.js";
import timeFormat from "../utils/timeFormat.js";

export const downloadTicket = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (!booking.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const show = await Show.findById(booking.show).populate("movie");

    const bookingData = {
      id: booking._id.toString(),
      movie: show.movie.title,
      theatre: "QuickTicket Cinema",
      screen: "Screen 2",
      date: dateFormat(show.showDateTime),
      time: timeFormat(show.showDateTime),
      seats: booking.bookedSeats.join(", "),
      amount: booking.amount,
    };

    const pdfPath = await generateTicket(bookingData);

    return res.download(
      pdfPath,
      `QuickTicket-${booking._id}.pdf`
    );

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};