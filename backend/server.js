import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";

dotenv.config();

const app = express();
const port = 3000;

await connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// API Route
app.get("/", (req, res) => {
  res.send("Server is live!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});