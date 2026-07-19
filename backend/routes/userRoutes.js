import express from "express";
import { getFavourites, getUserBookings, syncUser, updateFavourite } from "../controllers/userController.js";

const router = express.Router();
//for user connection
router.post("/sync", syncUser);

//user bookings
router.get("/bookings",getUserBookings);
router.post("/update-favorite",updateFavourite);
router.get("/favorites", getFavourites);


export default router;