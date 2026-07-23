import cron from "node-cron";
import { Booking } from "../models/Booking.js";
import { Show } from "../models/Show.js";

const bookingExpiryJob = () => {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Checking expired bookings...");

      const expiredBookings = await Booking.find({
        status: "pending",
        isPaid: false,
        expiresAt: { $lte: new Date() },
      });

      if (expiredBookings.length === 0) {
        return;
      }

      for (const booking of expiredBookings) {

        // Safety check (avoid deleting paid bookings)
        if (booking.isPaid || booking.status === "paid") {
          continue;
        }

        // Find the show
        const show = await Show.findById(booking.show);

        // Release booked seats if show exists
        if (show) {
          booking.bookedSeats.forEach((seat) => {
            delete show.occupiedSeats[seat];
          });

          show.markModified("occupiedSeats");
          await show.save();
        }

        // Delete expired booking
        await Booking.findByIdAndDelete(booking._id);

        console.log(`Expired booking deleted: ${booking._id}`);
      }
    } catch (error) {
      console.error("Booking Expiry Job Error:", error);
    }
  });
};

export default bookingExpiryJob;