import mongoose, { Document, Schema } from 'mongoose';

const MilestoneSchema = new Schema({
  title: String,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  deadline?: Date;
  status: 'active' | 'completed' | 'paused';
  milestones: typeof MilestoneSchema[];
}

const GoalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: String,
    deadline: Date,
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
    milestones: [MilestoneSchema],
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema);