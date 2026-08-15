import express from 'express';
import { getHostels, getHostelById, createHostel } from '../controllers/hostelController.js';

const router = express.Router();

router.route('/')
    .get(getHostels)
    .post(createHostel);

router.route('/:id')
    .get(getHostelById);

export default router;
