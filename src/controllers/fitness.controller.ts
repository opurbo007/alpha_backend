import { Response } from 'express';
import { Workout } from '../models/Workout.model';
import { BodyStat } from '../models/BodyStat.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

// Workouts
export const getWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, workouts);
  } catch { sendError(res, 'Failed to get workouts'); }
};

export const createWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await Workout.create({ ...req.body, userId: req.user._id });
    sendSuccess(res, workout, 'Workout saved', 201);
  } catch { sendError(res, 'Failed to save workout'); }
};

export const updateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!workout) { sendError(res, 'Workout not found', 404); return; }
    sendSuccess(res, workout, 'Workout updated');
  } catch { sendError(res, 'Failed to update workout'); }
};

export const deleteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    sendSuccess(res, null, 'Workout deleted');
  } catch { sendError(res, 'Failed to delete workout'); }
};

// Body stats
export const getBodyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await BodyStat.find({ userId: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, stats);
  } catch { sendError(res, 'Failed to get body stats'); }
};

export const createBodyStat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stat = await BodyStat.create({ ...req.body, userId: req.user._id });
    sendSuccess(res, stat, 'Stat logged', 201);
  } catch { sendError(res, 'Failed to log stat'); }
};

export const deleteBodyStat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await BodyStat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    sendSuccess(res, null, 'Stat deleted');
  } catch { sendError(res, 'Failed to delete stat'); }
};