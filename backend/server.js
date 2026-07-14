import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

await connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Server is Live!");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});