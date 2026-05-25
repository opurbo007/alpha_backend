import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
  date: string;
  carriedOver: boolean;
  priority: "high" | "medium" | "low";
}

const TaskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    date: { type: String, required: true },
    carriedOver: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
