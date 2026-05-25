import mongoose, { Document, Schema } from 'mongoose';

export interface ITarget extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  period: 'daily' | 'weekly' | 'monthly';
  targetValue: number;
  currentValue: number;
  unit: string;
  customUnit?: string;
  lastResetAt: Date;
}

const TargetSchema = new Schema<ITarget>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    period: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, required: true },
    customUnit: String,
    lastResetAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Target = mongoose.model<ITarget>('Target', TargetSchema);