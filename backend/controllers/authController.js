import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'dormquest_jwt_secret_key_2026_super_secure', {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, name, phone, address, bio, dob, gender } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email, and password' });
        }

        // Check if user already exists
        const userExists = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }]
        });

        if (userExists) {
            return res.status(400).json({
                message: userExists.email === email.toLowerCase()
                    ? 'User with this email already exists'
                    : 'Username is already taken'
            });
        }

        // Create user
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            name: name || username,
            phone: phone || '',
            address: address || '',
            bio: bio || '',
            dob: dob || '',
            gender: gender || ''
        });

        if (user) {
            res.status(201).json({
                token: generateToken(user._id),
                user: user.toJSON()
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const loginIdentifier = username || email;
        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: 'Please provide username/email and password' });
        }

        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { username: loginIdentifier },
                { email: loginIdentifier.toLowerCase() }
            ]
        });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                token: generateToken(user._id),
                user: user.toJSON()
            });
        } else {
            res.status(401).json({ message: 'UserName or password not correct' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.status(200).json(user.toJSON());
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
