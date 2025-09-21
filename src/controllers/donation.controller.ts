import { Request, Response } from 'express';
import { DonationService } from '../services/donation.service.js';
import { ProjectService } from '../services/project.service.js';
import { CreateDonationDto } from '../types/index.js';
import logger from '../utils/logger.js';

export class DonationController {
  private donationService: DonationService;
  private projectService: ProjectService;

  constructor(
    donationService?: DonationService,
    projectService?: ProjectService
  ) {
    // Allow dependency injection for testing
    this.donationService = donationService || new DonationService();
    this.projectService = projectService || new ProjectService();
  }

  /**
   * Create a new donation
   * @param req Express request object
   * @param res Express response object
   */
  createDonation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId, amount, paymentGateway } = req.body;

      logger.info('Creating donation', { projectId, amount, paymentGateway });

      // Validate request body (additional validation beyond middleware)
      if (!projectId) {
        logger.warn('Missing project ID in donation request');
        res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
        return;
      }

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        logger.warn('Invalid amount in donation request', { amount });
        res.status(400).json({
          success: false,
          message: 'Valid amount is required'
        });
        return;
      }

      // Check if project exists
      const project = await this.projectService.getProjectById(projectId);
      if (!project) {
        logger.warn('Project not found for donation', { projectId });
        res.status(404).json({
          success: false,
          message: `Project with ID ${projectId} not found`
        });
        return;
      }

      // Create donation data
      const donationData: CreateDonationDto = {
        projectId,
        amount: Number(amount),
        paymentGateway
      };

      // Create donation
      const newDonation = await this.donationService.createDonation(donationData);

      // Update project amount
      const updatedProject = await this.projectService.updateProjectAmount(projectId, Number(amount));

      if (!updatedProject) {
        logger.error('Failed to update project amount', { projectId });
        res.status(500).json({
          success: false,
          message: 'Failed to update project amount'
        });
        return;
      }

      logger.info('Donation created successfully', {
        donationId: newDonation._id,
        projectId,
        amount
      });      res.status(201).json({
        success: true,
        data: {
          donation: newDonation,
          project: updatedProject
        }
      });
    } catch (error) {
      const err = error as Error;
      logger.error('Error creating donation', {
        error: err.message,
        stack: err.stack,
        projectId: req.body?.projectId
      });
      res.status(500).json({
        success: false,
        message: 'Failed to create donation'
      });
    }
  };
}
