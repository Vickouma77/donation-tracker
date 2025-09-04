import express from 'express';
import { ProjectController } from '../controllers/project.controller.js';

const router = express.Router();
const projectController = new ProjectController();

// GET /projects - Get all projects
router.get('/', projectController.getAllProjects);

// GET /projects/:id - Get a project by ID
router.get('/:id', projectController.getProjectById);

export default router;
