import Stripe from "stripe";
import { Booking } from "../models/Booking.js";
import { Show } from "../models/Show.js";
import { User } from "../models/User.js";
import sendBookingEmail from "../utils/sendBookingEmail.js";
import dateFormat from "../utils/dateFormat.js";
import timeFormat from "../utils/timeFormat.js";
console.log("stripeWebHooks.js loaded");
export const stripeWebhooks = async (req, res) => {
  console.log("====== WEBHOOK CALLED ======");
  console.log("Webhook Key:", process.env.STRIPE_WEBHOOK_KEY);
  console.log("Stripe Secret:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "Missing");
  console.log("Signature:", req.headers["stripe-signature"]);

  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_KEY
    );

    console.log("Webhook Verified!");
    console.log("Event:", event.type);

  } catch (error) {
    console.log("Webhook Verification Failed");
    console.log(error);

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];

        const { bookingId } = session.metadata;

        // Update booking
        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          status: "paid",
          paymentLink: "",
          expiresAt: null,
        });

        // Fetch booking
        const booking = await Booking.findById(bookingId);

        // Fetch user
        const user = await User.findById(booking.user);

        // Fetch show + movie
        const show = await Show.findById(booking.show).populate("movie");

        // Send confirmation email
        await sendBookingEmail(user.email, {
  id: booking._id,
  movie: show.movie.title,
  date: dateFormat(show.showDateTime),
  time: timeFormat(show.showDateTime),
  seats: booking.bookedSeats.join(", "),
  amount: booking.amount,
});

        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};