import express, { Router } from 'express'
import { cancelBooking, createBooking, getOccupiedSeats } from '../controllers/bookingControllers.js';
import { downloadTicket } from '../controllers/ticketController.js';

const bookingRouter = Router();

bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post("/cancel", cancelBooking);
bookingRouter.get("/:bookingId/ticket",downloadTicket);
export default bookingRouter;