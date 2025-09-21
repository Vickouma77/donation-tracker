import mongoose, { Document, Schema } from 'mongoose';

export interface IDonation extends Document {
  _id: string;
  projectId: string;
  amount: number;
  paymentGateway: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>({
  _id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  projectId: {
    type: String,
    required: [true, 'Project ID is required'],
    ref: 'Project', // Reference to Project model
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [0.01, 'Donation amount must be greater than 0'],
  },
  paymentGateway: {
    type: String,
    default: 'Direct',
    maxlength: [50, 'Payment gateway name cannot be more than 50 characters'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  _id: false, // Disable default _id since we're using custom _id
});

// Indexes for better query performance
DonationSchema.index({ projectId: 1 });
DonationSchema.index({ createdAt: -1 });
DonationSchema.index({ projectId: 1, createdAt: -1 }); // Compound index

// Virtual for formatted amount
DonationSchema.virtual('formattedAmount').get(function() {
  return `$${this.amount.toFixed(2)}`;
});

// Ensure virtual fields are serialized
DonationSchema.set('toJSON', { virtuals: true });
DonationSchema.set('toObject', { virtuals: true });

export const Donation = mongoose.model<IDonation>('Donation', DonationSchema);