import { donations } from '../models/data.js';
import { Donation, CreateDonationDto } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

export class DonationService {
  /**
   * Create a new donation
   */
  createDonation(donationData: CreateDonationDto): Donation {
    const newDonation: Donation = {
      id: uuidv4(),
      projectId: donationData.projectId,
      amount: donationData.amount,
      paymentGateway: donationData.paymentGateway || 'Direct',
      createdAt: new Date()
    };
    
    donations.push(newDonation);
    return newDonation;
  }

  /**
   * Get donations by project ID
   */
  getDonationsByProjectId(projectId: string): Donation[] {
    return donations.filter(donation => donation.projectId === projectId);
  }
}
