import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  _id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  goalAmount: {
    type: Number,
    required: [true, 'Goal amount is required'],
    min: [0.01, 'Goal amount must be greater than 0'],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  _id: false, // Disable default _id since we're using custom _id
});

// Indexes for better query performance
ProjectSchema.index({ title: 1 });
ProjectSchema.index({ createdAt: -1 });

// Virtual for progress percentage
ProjectSchema.virtual('progressPercentage').get(function() {
  if (this.goalAmount === 0) return 0;
  return Math.round((this.currentAmount / this.goalAmount) * 100);
});

// Ensure virtual fields are serialized
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure currentAmount doesn't exceed goalAmount
ProjectSchema.pre('save', function(next) {
  if (this.currentAmount > this.goalAmount) {
    this.currentAmount = this.goalAmount;
  }
  next();
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);