import mongoose, { Document, Schema } from "mongoose";

const LapSchema = new Schema(
  {
    lapNumber: Number,
    duration: Number,
    timestamp: String,
  },
  { _id: true },
);

export interface ITimerSession extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  customLabel?: string;
  duration: number;
  laps: (typeof LapSchema)[];
  startedAt: string;
  endedAt: string;
}

const TimerSessionSchema = new Schema<ITimerSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: { type: String, required: true },
    customLabel: String,
    duration: { type: Number, required: true },
    laps: [LapSchema],
    startedAt: String,
    endedAt: String,
  },
  { timestamps: true },
);

export const TimerSession = mongoose.model<ITimerSession>(
  "TimerSession",
  TimerSessionSchema,
);
