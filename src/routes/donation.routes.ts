import express from 'express';
import { DonationController } from '../controllers/donation.controller.js';

const router = express.Router();
const donationController = new DonationController();

// POST /donate - Create a new donation
router.post('/', donationController.createDonation);

export default router;
