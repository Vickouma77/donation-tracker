import { Request, Response } from 'express';
import { DonationService } from '../services/donation.service.js';
import { ProjectService } from '../services/project.service.js';
import { CreateDonationDto } from '../types/index.js';

const donationService = new DonationService();
const projectService = new ProjectService();

export class DonationController {
  /**
   * Create a new donation
   */
  createDonation = (req: Request, res: Response): void => {
    try {
      const { projectId, amount, paymentGateway } = req.body;

      // Validate request body
      if (!projectId) {
        res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
        return;
      }

      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        res.status(400).json({
          success: false,
          message: 'Valid amount is required'
        });
        return;
      }

      // Check if project exists
      const project = projectService.getProjectById(projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          message: `Project with ID ${projectId} not found`
        });
        return;
      }

      // Create donation
      const donationData: CreateDonationDto = {
        projectId,
        amount: Number(amount),
        paymentGateway
      };
      
      const newDonation = donationService.createDonation(donationData);
      
      // Update project amount
      const updatedProject = projectService.updateProjectAmount(projectId, Number(amount));
      
      if (!updatedProject) {
        res.status(500).json({
          success: false,
          message: 'Failed to update project amount'
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: {
          donation: newDonation,
          project: updatedProject
        }
      });
    } catch (error) {
      console.error('Error creating donation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create donation'
      });
    }
  };
}
