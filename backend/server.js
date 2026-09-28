import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";

import userRoutes from "./routes/userRoutes.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

import { stripeWebhooks } from "./controllers/stripeWebHooks.js";

import bookingExpiryJob from "./jobs/bookingExpiryJob.js";

import { initSocket } from "./configs/socket.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

await connectDB();

bookingExpiryJob();

/*
|--------------------------------------------------------------------------
| Stripe Webhook
|--------------------------------------------------------------------------
*/

app.use(
    "/api/stripe",
    express.raw({ type: "application/json" }),
    stripeWebhooks
);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
    cors({
        origin:
            process.env.FRONTEND_URL ||
            "http://localhost:5173",
    })
);

app.use(clerkMiddleware());

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api/users", userRoutes);

app.use("/api/show", showRouter);

app.use("/api/booking", bookingRouter);

app.use("/api/admin", adminRouter);

/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.send("🚀 Server is Live!");
});

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

server.listen(port, () => {
    console.log(
        `🚀 Server running on http://localhost:${port}`
    );

    console.log("🔌 Socket.IO is running");
});