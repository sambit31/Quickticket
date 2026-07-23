import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebHooks.js";
import bookingExpiryJob from "./jobs/bookingExpiryJob.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

await connectDB();
bookingExpiryJob();

//atripe
app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);


app.use(express.json());
app.use(cors());

app.use(clerkMiddleware());

app.use("/api/users", userRoutes);
app.use('/api/show', showRouter);
app.use('/api/booking',bookingRouter);
app.use('/api/admin',adminRouter)


app.get("/", (req, res) => {
  res.send("🚀 Server is Live!");
});
 


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});