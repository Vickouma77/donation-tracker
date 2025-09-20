import express from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import logger from '../utils/logger.js';

const router = express.Router();
const projectController = new ProjectController();

/**
 * @route GET /projects
 * @desc Get all projects
 * @access Public
 * @returns {Object} List of all projects
 */
router.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    await projectController.getAllProjects(req, res);
  } catch (error) {
    logger.error('Error in projects route', { error: (error as Error).message });
    next(error);
  }
});

/**
 * @route GET /projects/:id
 * @desc Get a project by ID
 * @access Public
 * @param {string} id - Project ID
 * @returns {Object} Project data
 */
router.get('/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    await projectController.getProjectById(req, res);
  } catch (error) {
    logger.error('Error in project by ID route', {
      error: (error as Error).message,
      projectId: req.params.id
    });
    next(error);
  }
});

export default router;
