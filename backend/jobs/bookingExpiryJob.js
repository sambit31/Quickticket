import cron from "node-cron";

import { Booking } from "../models/Booking.js";
import { Show } from "../models/Show.js";
import { getIO } from "../configs/socket.js";

const bookingExpiryJob = () => {

    // Runs every minute
    cron.schedule("* * * * *", async () => {

        try {

            const expiredBookings = await Booking.find({
                status: "pending",
                isPaid: false,
                expiresAt: { $lte: new Date() },
            });

            if (expiredBookings.length === 0) {
                return;
            }

            for (const booking of expiredBookings) {

                // Safety check
                if (booking.isPaid || booking.status === "paid") {
                    continue;
                }

                // Find the show
                const show = await Show.findById(booking.show);

                if (show) {

                    // Release seats
                    booking.bookedSeats.forEach((seat) => {
                        delete show.occupiedSeats[seat];
                    });

                    show.markModified("occupiedSeats");

                    await show.save();

                    // 🔥 Tell all users watching this show
                    const io = getIO();

                    io.to(`show:${booking.show}`).emit("seat-released", {
                        showId: booking.show.toString(),
                        seats: booking.bookedSeats,
                    });

                    console.log(
                        `🔓 Seats released: ${booking.bookedSeats.join(", ")}`
                    );
                }

                // Delete expired booking
                await Booking.findByIdAndDelete(booking._id);

                console.log(
                    `⏰ Expired booking deleted: ${booking._id}`
                );
            }

        } catch (error) {

            console.error(
                "Booking Expiry Job Error:",
                error
            );

        }
    });
};

export default bookingExpiryJob;