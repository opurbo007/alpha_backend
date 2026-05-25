import { Response } from 'express';
import { Goal } from '../models/Goal.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, goals);
  } catch { sendError(res, 'Failed to get goals'); }
};

export const createGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user._id });
    sendSuccess(res, goal, 'Goal created', 201);
  } catch { sendError(res, 'Failed to create goal'); }
};

export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!goal) { sendError(res, 'Goal not found', 404); return; }
    sendSuccess(res, goal, 'Goal updated');
  } catch { sendError(res, 'Failed to update goal'); }
};

export const deleteGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    sendSuccess(res, null, 'Goal deleted');
  } catch { sendError(res, 'Failed to delete goal'); }
};

export const addMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $push: { milestones: { title: req.body.title, completed: false } } },
      { new: true }
    );
    if (!goal) { sendError(res, 'Goal not found', 404); return; }
    sendSuccess(res, goal, 'Milestone added');
  } catch { sendError(res, 'Failed to add milestone'); }
};

export const updateMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.goalId, userId: req.user._id, 'milestones._id': req.params.milestoneId },
      { $set: { 'milestones.$.completed': req.body.completed } },
      { new: true }
    );
    if (!goal) { sendError(res, 'Not found', 404); return; }
    sendSuccess(res, goal, 'Milestone updated');
  } catch { sendError(res, 'Failed to update milestone'); }
};

export const deleteMilestone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.goalId, userId: req.user._id },
      { $pull: { milestones: { _id: req.params.milestoneId } } },
      { new: true }
    );
    sendSuccess(res, goal, 'Milestone deleted');
  } catch { sendError(res, 'Failed to delete milestone'); }
};