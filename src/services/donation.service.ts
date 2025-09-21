import { Donation, IDonation } from '../models/donation.model.js';
import { CreateDonationDto } from '../types/index.js';
import logger from '../utils/logger.js';

export class DonationService {
  /**
   * Create a new donation
   */
  async createDonation(donationData: CreateDonationDto): Promise<IDonation> {
    try {
      logger.info('Creating new donation', {
        projectId: donationData.projectId,
        amount: donationData.amount,
        paymentGateway: donationData.paymentGateway || 'Direct'
      });

      const donation = new Donation({
        projectId: donationData.projectId,
        amount: donationData.amount,
        paymentGateway: donationData.paymentGateway || 'Direct',
      });

      const savedDonation = await donation.save();
      logger.info('Donation created successfully', {
        donationId: savedDonation._id,
        projectId: donationData.projectId
      });

      return savedDonation;
    } catch (error) {
      logger.error('Error creating donation', {
        projectId: donationData.projectId,
        amount: donationData.amount,
        error: (error as Error).message
      });
      throw new Error('Failed to create donation');
    }
  }

  /**
   * Get donations by project ID
   */
  async getDonationsByProjectId(projectId: string): Promise<IDonation[]> {
    try {
      logger.debug('Fetching donations by project ID', { projectId });

      const donations = await Donation.find({ projectId })
        .sort({ createdAt: -1 });

      logger.debug(`Retrieved ${donations.length} donations for project`, { projectId });
      return donations;
    } catch (error) {
      logger.error('Error fetching donations by project ID', {
        projectId,
        error: (error as Error).message
      });
      throw new Error('Failed to retrieve donations');
    }
  }

  /**
   * Get all donations with optional pagination
   */
  async getAllDonations(limit: number = 50, offset: number = 0): Promise<IDonation[]> {
    try {
      logger.debug('Fetching all donations', { limit, offset });

      const donations = await Donation.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);

      logger.debug(`Retrieved ${donations.length} donations`);
      return donations;
    } catch (error) {
      logger.error('Error fetching all donations', {
        limit,
        offset,
        error: (error as Error).message
      });
      throw new Error('Failed to retrieve donations');
    }
  }

  /**
   * Get donation statistics
   */
  async getDonationStats(): Promise<{
    totalDonations: number;
    totalAmount: number;
    averageDonation: number;
  }> {
    try {
      logger.debug('Calculating donation statistics');

      const stats = await Donation.aggregate([
        {
          $group: {
            _id: null,
            totalDonations: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            averageDonation: { $avg: '$amount' },
          },
        },
      ]);

      const result = stats[0] || {
        totalDonations: 0,
        totalAmount: 0,
        averageDonation: 0,
      };

      logger.debug('Donation statistics calculated', result);
      return result;
    } catch (error) {
      logger.error('Error calculating donation statistics', {
        error: (error as Error).message
      });
      throw new Error('Failed to calculate donation statistics');
    }
  }

  /**
   * Delete a donation
   */
  async deleteDonation(donationId: string): Promise<boolean> {
    try {
      logger.info('Deleting donation', { donationId });

      const result = await Donation.findByIdAndDelete(donationId);

      if (!result) {
        logger.warn('Donation not found for deletion', { donationId });
        return false;
      }

      logger.info('Donation deleted successfully', { donationId });
      return true;
    } catch (error) {
      logger.error('Error deleting donation', {
        donationId,
        error: (error as Error).message
      });
      throw new Error('Failed to delete donation');
    }
  }
}
