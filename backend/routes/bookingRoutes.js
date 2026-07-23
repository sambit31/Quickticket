import express, { Router } from 'express'
import { cancelBooking, createBooking, getOccupiedSeats } from '../controllers/bookingControllers.js';

const bookingRouter = Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post("/cancel", cancelBooking);
export default bookingRouter;