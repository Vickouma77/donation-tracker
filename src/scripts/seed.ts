import Database from '../utils/database.js';
import { ProjectService } from '../services/project.service.js';
import { DonationService } from '../services/donation.service.js';
import logger from '../utils/logger.js';

const sampleProjects = [
  {
    title: 'Clean Water Initiative',
    description: 'Providing clean drinking water to rural communities in Africa',
    goalAmount: 10000,
  },
  {
    title: 'Education for All',
    description: 'Building schools and providing educational materials for underserved communities',
    goalAmount: 25000,
  },
  {
    title: 'Wildlife Conservation',
    description: 'Protecting endangered species and their habitats',
    goalAmount: 15000,
  },
];

const sampleDonations = [
  {
    projectIndex: 0, // Index in sampleProjects array
    amount: 1000,
    paymentGateway: 'PayPal',
  },
  {
    projectIndex: 0,
    amount: 1500,
    paymentGateway: 'Stripe',
  },
  {
    projectIndex: 1,
    amount: 5000,
    paymentGateway: 'PayPal',
  },
  {
    projectIndex: 1,
    amount: 3750,
    paymentGateway: 'Bank Transfer',
  },
  {
    projectIndex: 2,
    amount: 5200,
    paymentGateway: 'Stripe',
  },
];

export async function seedDatabase(): Promise<void> {
  try {
    logger.info('Starting database seeding...');

    // Connect to database
    const db = Database.getInstance();
    await db.connect();

    const projectService = new ProjectService();
    const donationService = new DonationService();

    // Check if data already exists
    const existingProjects = await projectService.getAllProjects();
    if (existingProjects.length > 0) {
      logger.info('Database already contains data, skipping seeding');
      return;
    }

    logger.info('Creating sample projects...');

    // Create projects
    const createdProjects = [];
    for (const projectData of sampleProjects) {
      const project = await projectService.createProject(projectData);
      createdProjects.push(project);
      logger.info(`Created project: ${project.title}`);
    }

    logger.info('Creating sample donations...');

    // Create donations
    for (const donationData of sampleDonations) {
      const project = createdProjects[donationData.projectIndex];
      if (project) {
        await donationService.createDonation({
          projectId: project._id,
          amount: donationData.amount,
          paymentGateway: donationData.paymentGateway,
        });

        // Update project amount
        await projectService.updateProjectAmount(project._id, donationData.amount);

        logger.info(`Created donation: $${donationData.amount} for ${project.title}`);
      }
    }

    logger.info('Database seeding completed successfully!');

    // Log final state
    const finalProjects = await projectService.getAllProjects();
    const stats = await donationService.getDonationStats();

    logger.info('Final database state:', {
      projectsCount: finalProjects.length,
      totalDonations: stats.totalDonations,
      totalAmount: stats.totalAmount,
    });

  } catch (error) {
    logger.error('Database seeding failed', { error: (error as Error).message });
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      logger.info('Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding script failed', { error: error.message });
      process.exit(1);
    });
}