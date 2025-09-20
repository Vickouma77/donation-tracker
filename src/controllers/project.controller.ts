import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service.js';
import logger from '../utils/logger.js';

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService?: ProjectService) {
    // Allow dependency injection for testing
    this.projectService = projectService || new ProjectService();
  }

  /**
   * Get all projects
   * @param req Express request object
   * @param res Express response object
   */
  getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      logger.info('Fetching all projects');
      const projects = this.projectService.getAllProjects();

      logger.info('Projects retrieved successfully', { count: projects.length });
      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error) {
      const err = error as Error;
      logger.error('Error getting projects', {
        error: err.message,
        stack: err.stack
      });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve projects'
      });
    }
  };

  /**
   * Get a project by ID
   * @param req Express request object
   * @param res Express response object
   */
  getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        logger.warn('Missing project ID in request');
        res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
        return;
      }

      logger.info('Fetching project by ID', { projectId: id });
      const project = this.projectService.getProjectById(id);

      if (!project) {
        logger.warn('Project not found', { projectId: id });
        res.status(404).json({
          success: false,
          message: `Project with ID ${id} not found`
        });
        return;
      }

      logger.info('Project retrieved successfully', { projectId: id });
      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      const err = error as Error;
      logger.error('Error getting project by ID', {
        error: err.message,
        stack: err.stack,
        projectId: req.params.id
      });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve project'
      });
    }
  };
}
