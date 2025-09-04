import { projects, donations } from '../models/data.js';
import { Project } from '../types/index.js';

export class ProjectService {
  /**
   * Get all projects
   */
  getAllProjects(): Project[] {
    return projects;
  }

  /**
   * Get a project by ID
   */
  getProjectById(id: string): Project | undefined {
    return projects.find(project => project.id === id);
  }

  /**
   * Update a project's current amount
   */
  updateProjectAmount(projectId: string, amount: number): Project | null {
    const projectIndex = projects.findIndex(project => project.id === projectId);
    
    if (projectIndex === -1) {
      return null;
    }
    
    projects[projectIndex].currentAmount += amount;
    return projects[projectIndex];
  }
}
