import { Project, Donation } from '../types/index.js';

// In-memory data storage
export const projects: Project[] = [
  {
    id: '1',
    title: 'Clean Water Initiative',
    description: 'Providing clean drinking water to rural communities in Africa',
    goalAmount: 10000,
    currentAmount: 2500
  },
  {
    id: '2',
    title: 'Education for All',
    description: 'Building schools and providing educational materials for underserved communities',
    goalAmount: 25000,
    currentAmount: 8750
  },
  {
    id: '3',
    title: 'Wildlife Conservation',
    description: 'Protecting endangered species and their habitats',
    goalAmount: 15000,
    currentAmount: 5200
  }
];

export const donations: Donation[] = [
  {
    id: '1',
    projectId: '1',
    amount: 1000,
    paymentGateway: 'PayPal',
    createdAt: new Date('2025-08-15')
  },
  {
    id: '2',
    projectId: '1',
    amount: 1500,
    paymentGateway: 'Stripe',
    createdAt: new Date('2025-08-20')
  },
  {
    id: '3',
    projectId: '2',
    amount: 5000,
    paymentGateway: 'PayPal',
    createdAt: new Date('2025-08-10')
  },
  {
    id: '4',
    projectId: '2',
    amount: 3750,
    paymentGateway: 'Bank Transfer',
    createdAt: new Date('2025-08-25')
  },
  {
    id: '5',
    projectId: '3',
    amount: 5200,
    paymentGateway: 'Stripe',
    createdAt: new Date('2025-08-18')
  }
];
