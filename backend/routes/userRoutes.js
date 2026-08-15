import express from 'express';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/me')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .patch(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);

router.route('/:id')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .patch(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);

export default router;
