export interface Project {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
}

export interface Donation {
  id: string;
  projectId: string;
  amount: number;
  paymentGateway: string;
  createdAt: Date;
}

export interface CreateDonationDto {
  projectId: string;
  amount: number;
  paymentGateway?: string;
}
