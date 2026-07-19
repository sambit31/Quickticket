import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

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