import Hostel from '../models/Hostel.js';
import mongoose from 'mongoose';

// @desc    Fetch all hostels (with optional search, rating, price, amenities filtering)
// @route   GET /api/hostels
// @access  Public
export const getHostels = async (req, res) => {
    try {
        const { search, searchTerm, minRating, maxPrice, amenities, location } = req.query;
        const query = {};

        const searchKeyword = searchTerm || search;
        if (searchKeyword) {
            query.$or = [
                { name: { $regex: searchKeyword, $options: 'i' } },
                { description: { $regex: searchKeyword, $options: 'i' } },
                { address: { $regex: searchKeyword, $options: 'i' } }
            ];
        }

        if (location) {
            query.address = { $regex: location, $options: 'i' };
        }

        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        if (maxPrice) {
            query.pricePerNight = { $lte: Number(maxPrice) };
        }

        if (amenities) {
            const amenitiesList = Array.isArray(amenities)
                ? amenities
                : amenities.split(',').map(a => a.trim());
            query.amenities = { $all: amenitiesList };
        }

        const hostels = await Hostel.find(query).sort({ id: 1 });
        res.status(200).json(hostels);
    } catch (error) {
        console.error('Error fetching hostels:', error);
        res.status(500).json({ message: error.message || 'Server error while fetching hostels' });
    }
};

// @desc    Fetch single hostel by ID (supports numeric id or MongoDB _id)
// @route   GET /api/hostels/:id
// @access  Public
export const getHostelById = async (req, res) => {
    try {
        const { id } = req.params;
        let hostel = null;

        // Try searching by numeric id first if it's a number
        if (!isNaN(id)) {
            hostel = await Hostel.findOne({ id: Number(id) });
        }

        // If not found and id is a valid Mongo ObjectId, search by _id
        if (!hostel && mongoose.Types.ObjectId.isValid(id)) {
            hostel = await Hostel.findById(id);
        }

        // Fallback string match
        if (!hostel) {
            hostel = await Hostel.findOne({ $or: [{ id: id }, { _id: id }] });
        }

        if (hostel) {
            res.status(200).json(hostel);
        } else {
            res.status(404).json({ message: 'Hostel not found' });
        }
    } catch (error) {
        console.error('Error fetching hostel by ID:', error);
        res.status(500).json({ message: error.message || 'Server error while fetching hostel' });
    }
};

// @desc    Create a hostel
// @route   POST /api/hostels
// @access  Private/Admin
export const createHostel = async (req, res) => {
    try {
        const hostelData = req.body;
        const count = await Hostel.countDocuments();
        if (!hostelData.id) {
            hostelData.id = count + 1;
        }

        const hostel = await Hostel.create(hostelData);
        res.status(201).json(hostel);
    } catch (error) {
        console.error('Error creating hostel:', error);
        res.status(400).json({ message: error.message || 'Invalid hostel data' });
    }
};
