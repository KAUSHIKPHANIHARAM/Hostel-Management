import Booking from '../models/Booking.js';
import mongoose from 'mongoose';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public (Optionally Authenticated)
export const createBooking = async (req, res) => {
    try {
        const {
            name,
            email,
            roomType,
            guests,
            arrivalDate,
            departureDate,
            specialRequests,
            hostelId,
            hostelName,
            nights,
            totalPrice
        } = req.body;

        if (!name || !email || !roomType || !arrivalDate || !departureDate) {
            return res.status(400).json({ message: 'Please fill in all required booking fields' });
        }

        const bookingData = {
            name,
            email,
            roomType,
            guests: Number(guests) || 1,
            arrivalDate,
            departureDate,
            specialRequests: specialRequests || 'no',
            hostelId: hostelId ? hostelId.toString() : '',
            hostelName: hostelName || 'Hostel',
            nights: Number(nights) || 1,
            totalPrice: Number(totalPrice) || 0,
            status: 'confirmed'
        };

        // If authenticated, associate booking with user
        if (req.user) {
            bookingData.userId = req.user._id;
        }

        const booking = await Booking.create(bookingData);
        res.status(201).json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(400).json({ message: error.message || 'Failed to create booking' });
    }
};

// @desc    Get bookings (for authenticated user or all)
// @route   GET /api/bookings
// @access  Public/Private
export const getBookings = async (req, res) => {
    try {
        let query = {};

        // If authenticated user, retrieve their bookings
        if (req.user) {
            query = {
                $or: [
                    { userId: req.user._id },
                    { email: req.user.email }
                ]
            };
        } else if (req.query.email) {
            query = { email: req.query.email };
        }

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: error.message || 'Server error while fetching bookings' });
    }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Public/Private
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        let booking = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            booking = await Booking.findById(id);
        } else {
            booking = await Booking.findOne({ id: id });
        }

        if (booking) {
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        console.error('Error fetching booking by ID:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Cancel / Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        let booking = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            booking = await Booking.findById(id);
        } else {
            booking = await Booking.findOne({ id: id });
        }

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await Booking.deleteOne({ _id: booking._id });
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
