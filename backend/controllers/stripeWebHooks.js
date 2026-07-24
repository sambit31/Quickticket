import Stripe from "stripe";
import { Booking } from "../models/Booking.js";
import { Show } from "../models/Show.js";
import { User } from "../models/User.js";
import sendBookingEmail from "../utils/sendBookingEmail.js";
import dateFormat from "../utils/dateFormat.js";
import timeFormat from "../utils/timeFormat.js";

export const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const bookingId = session.metadata.bookingId;

        if (!bookingId) break;

        const booking = await Booking.findById(bookingId);

        if (!booking) break;

        if (!booking.isPaid) {
          booking.isPaid = true;
          booking.status = "paid";
          booking.paymentLink = "";

          await booking.save();
        }

        const user = await User.findById(booking.user);
        const show = await Show.findById(booking.show).populate("movie");

        if (user && show) {
          await sendBookingEmail(user.email, {
            id: booking._id,
            movie: show.movie.title,
            date: dateFormat(show.showDateTime),
            time: timeFormat(show.showDateTime),
            seats: booking.bookedSeats.join(", "),
            amount: booking.amount,
          });
        }

        break;
      }

      default:
        break;
    }

    return res.json({ received: true });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};