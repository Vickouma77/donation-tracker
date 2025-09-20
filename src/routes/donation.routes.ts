import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { DonationController } from '../controllers/donation.controller.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

const router = express.Router();
const donationController = new DonationController();

// Rate limiting: Limit donation requests to prevent abuse
const donationLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: {
    success: false,
    message: 'Too many donation requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimitWindowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in test environment
  skip: () => config.nodeEnv === 'test',
});

/**
 * Validation middleware for donation creation
 */
const validateDonation = [
  body('projectId')
    .isUUID()
    .withMessage('projectId must be a valid UUID')
    .notEmpty()
    .withMessage('projectId is required'),

  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('amount must be a positive number greater than 0')
    .notEmpty()
    .withMessage('amount is required'),

  body('paymentGateway')
    .optional()
    .isString()
    .withMessage('paymentGateway must be a string')
    .isLength({ max: 50 })
    .withMessage('paymentGateway must be less than 50 characters'),
];

/**
 * @route POST /donate
 * @desc Create a new donation
 * @access Public
 * @param {string} projectId - The UUID of the project to donate to
 * @param {number} amount - The donation amount (must be > 0)
 * @param {string} [paymentGateway] - Optional payment gateway identifier
 * @returns {Object} Success response with donation and updated project data
 */
router.post(
  '/',
  donationLimiter,
  validateDonation,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Donation validation failed', {
          errors: errors.array(),
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { projectId, amount, paymentGateway } = req.body;

      // Log the donation attempt
      logger.info('Processing donation request', {
        projectId,
        amount,
        paymentGateway: paymentGateway || 'Direct',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Process the donation
      await donationController.createDonation(req, res);

      // Success logging is handled in the controller

    } catch (error) {
      const err = error as Error;
      logger.error('Error in donation route', {
        error: err.message,
        stack: err.stack,
        projectId: req.body?.projectId,
        ip: req.ip
      });
      next(error);
    }
  }
);

export default router;
