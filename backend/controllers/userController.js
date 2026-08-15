import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Get user profile by ID or /me
// @route   GET /api/users/:id or GET /api/users/me
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const targetId = req.params.id === 'me' ? req.user._id : req.params.id;

        let user = null;
        if (mongoose.Types.ObjectId.isValid(targetId)) {
            user = await User.findById(targetId).select('-password');
        } else {
            user = await User.findOne({ username: targetId }).select('-password');
        }

        if (user) {
            res.status(200).json(user.toJSON());
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update user profile
// @route   PATCH /api/users/:id or PUT /api/users/:id or PUT /api/users/me
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        // Use authenticated user's ID to prevent updating other accounts
        const targetId = req.user ? req.user._id : req.params.id;

        let user = null;
        if (mongoose.Types.ObjectId.isValid(targetId)) {
            user = await User.findById(targetId);
        } else {
            user = await User.findOne({ username: targetId });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username, email, password, name, phone, address, bio, dob, gender } = req.body;

        if (username && username !== user.username) {
            const usernameTaken = await User.findOne({ username });
            if (usernameTaken && usernameTaken._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
            user.username = username;
        }

        if (email && email.toLowerCase() !== user.email) {
            const emailTaken = await User.findOne({ email: email.toLowerCase() });
            if (emailTaken && emailTaken._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email.toLowerCase();
        }

        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (bio !== undefined) user.bio = bio;
        if (dob !== undefined) user.dob = dob;
        if (gender !== undefined) user.gender = gender;

        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();

        res.status(200).json(updatedUser.toJSON());
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: error.message || 'Server error while updating profile' });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUserAccount = async (req, res) => {
    try {
        const targetId = req.user ? req.user._id : req.params.id;

        const user = await User.findById(targetId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: error.message || 'Server error while deleting account' });
    }
};
