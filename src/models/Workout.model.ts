import mongoose, { Document, Schema } from 'mongoose';

const SetSchema = new Schema({
  reps: Number,
  weight: Number,
  duration: Number,
  note: String,
}, { _id: true });

const ExerciseSchema = new Schema({
  name: String,
  sets: [SetSchema],
}, { _id: true });

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  exercises: typeof ExerciseSchema[];
  durationSeconds: number;
  date: string;
  note?: string;
}

const WorkoutSchema = new Schema<IWorkout>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    exercises: [ExerciseSchema],
    durationSeconds: { type: Number, default: 0 },
    date: String,
    note: String,
  },
  { timestamps: true }
);

export const Workout = mongoose.model<IWorkout>('Workout', WorkoutSchema);