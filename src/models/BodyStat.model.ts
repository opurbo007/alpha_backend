import mongoose, { Document, Schema } from "mongoose";

export interface IBodyStat extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  customLabel?: string;
  value: number;
  unit: string;
}

const BodyStatSchema = new Schema<IBodyStat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, required: true },
    customLabel: String,
    value: { type: Number, required: true },
    unit: { type: String, required: true },
  },
  { timestamps: true },
);

export const BodyStat = mongoose.model<IBodyStat>("BodyStat", BodyStatSchema);
