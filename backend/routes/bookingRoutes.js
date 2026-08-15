import express from 'express';
import { createBooking, getBookings, getBookingById, deleteBooking } from '../controllers/bookingController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(optionalAuth, createBooking)
    .get(optionalAuth, getBookings);

router.route('/:id')
    .get(optionalAuth, getBookingById)
    .delete(protect, deleteBooking);

export default router;
