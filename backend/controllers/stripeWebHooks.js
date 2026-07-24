import Stripe from "stripe";
import { Booking } from "../models/Booking.js";
import { Show } from "../models/Show.js";
import { User } from "../models/User.js";
import sendBookingEmail from "../utils/sendBookingEmail.js";
import dateFormat from "../utils/dateFormat.js";
import timeFormat from "../utils/timeFormat.js";

  
export const stripeWebhooks = async (req, res) => {
  console.log("========== WEBHOOK ==========");
  console.log("Secret exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("Webhook secret exists:", !!process.env.STRIPE_WEBHOOK_KEY);
  console.log("Signature exists:", !!req.headers["stripe-signature"]);
  console.log("Body type:", typeof req.body);
  console.log("Is Buffer:", Buffer.isBuffer(req.body));

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );

    console.log("✅ Webhook Verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook Verification Failed");
    console.error(err.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const bookingId = session.metadata.bookingId;

        if (!bookingId) {
          console.log("❌ Booking ID not found in metadata");
          break;
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
          console.log("❌ Booking not found");
          break;
        }

        if (!booking.isPaid) {
          booking.isPaid = true;
          booking.status = "paid";
          booking.paymentLink = "";
          booking.expiresAt = null;
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

          console.log("✅ Confirmation email sent");
        }

        break;
      }

      default:
        console.log(`Unhandled Event: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Processing Error");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};