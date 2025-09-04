import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service.js';

const projectService = new ProjectService();

export class ProjectController {
  /**
   * Get all projects
   */
  getAllProjects = (req: Request, res: Response): void => {
    try {
      const projects = projectService.getAllProjects();
      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error) {
      console.error('Error getting projects:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve projects'
      });
    }
  };

  /**
   * Get a project by ID
   */
  getProjectById = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
        return;
      }

      const project = projectService.getProjectById(id);
      
      if (!project) {
        res.status(404).json({
          success: false,
          message: `Project with ID ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error(`Error getting project with ID ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve project'
      });
    }
  };
}
