import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'User'},
    show: {type: String, required: true, ref: 'Show'},
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type:Boolean, default:false},
    paymentLink: {type: String, default: "",},
     status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },

    // NEW
    expiresAt: {
      type: Date,
      required: true,
    },
},{timestamps:true})

export const Booking = mongoose.model("Booking", bookingSchema);