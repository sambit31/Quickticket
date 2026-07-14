import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect Database
await connectDB();

// Middleware
app.use(express.json());
app.use(cors());


// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Server is Live!");
});

// Inngest Route
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);


app.use(clerkMiddleware());

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});