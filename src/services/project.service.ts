import { Project, IProject } from '../models/project.model.js';
import logger from '../utils/logger.js';

export class ProjectService {
  /**
   * Get all projects
   */
  async getAllProjects(): Promise<IProject[]> {
    try {
      logger.debug('Fetching all projects from database');
      const projects = await Project.find().sort({ createdAt: -1 });
      logger.debug(`Retrieved ${projects.length} projects`);
      return projects;
    } catch (error) {
      logger.error('Error fetching projects', { error: (error as Error).message });
      throw new Error('Failed to retrieve projects');
    }
  }

  /**
   * Get a project by ID
   */
  async getProjectById(id: string): Promise<IProject | null> {
    try {
      logger.debug('Fetching project by ID', { projectId: id });
      const project = await Project.findById(id);

      if (!project) {
        logger.warn('Project not found', { projectId: id });
        return null;
      }

      logger.debug('Project retrieved successfully', { projectId: id });
      return project;
    } catch (error) {
      logger.error('Error fetching project by ID', {
        projectId: id,
        error: (error as Error).message
      });
      throw new Error('Failed to retrieve project');
    }
  }

  /**
   * Create a new project
   */
  async createProject(projectData: {
    title: string;
    description: string;
    goalAmount: number;
  }): Promise<IProject> {
    try {
      logger.info('Creating new project', { title: projectData.title });

      const project = new Project({
        title: projectData.title,
        description: projectData.description,
        goalAmount: projectData.goalAmount,
        currentAmount: 0,
      });

      const savedProject = await project.save();
      logger.info('Project created successfully', { projectId: savedProject._id });

      return savedProject;
    } catch (error) {
      logger.error('Error creating project', {
        title: projectData.title,
        error: (error as Error).message
      });
      throw new Error('Failed to create project');
    }
  }

  /**
   * Update a project's current amount
   */
  async updateProjectAmount(projectId: string, additionalAmount: number): Promise<IProject | null> {
    try {
      logger.debug('Updating project amount', { projectId, additionalAmount });

      // Use atomic update to prevent race conditions
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $inc: { currentAmount: additionalAmount },
          $set: { updatedAt: new Date() }
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Run schema validators
        }
      );

      if (!updatedProject) {
        logger.warn('Project not found for amount update', { projectId });
        return null;
      }

      // Ensure currentAmount doesn't exceed goalAmount
      if (updatedProject.currentAmount > updatedProject.goalAmount) {
        updatedProject.currentAmount = updatedProject.goalAmount;
        await updatedProject.save();
        logger.debug('Project amount capped at goal amount', { projectId });
      }

      logger.info('Project amount updated successfully', {
        projectId,
        newAmount: updatedProject.currentAmount,
        goalAmount: updatedProject.goalAmount
      });

      return updatedProject;
    } catch (error) {
      logger.error('Error updating project amount', {
        projectId,
        additionalAmount,
        error: (error as Error).message
      });
      throw new Error('Failed to update project amount');
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      logger.info('Deleting project', { projectId });

      const result = await Project.findByIdAndDelete(projectId);

      if (!result) {
        logger.warn('Project not found for deletion', { projectId });
        return false;
      }

      logger.info('Project deleted successfully', { projectId });
      return true;
    } catch (error) {
      logger.error('Error deleting project', {
        projectId,
        error: (error as Error).message
      });
      throw new Error('Failed to delete project');
    }
  }
}
