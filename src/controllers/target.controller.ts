import { Response } from 'express';
import { Target } from '../models/Target.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTargets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targets = await Target.find({ userId: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, targets);
  } catch { sendError(res, 'Failed to get targets'); }
};

export const createTarget = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const target = await Target.create({ ...req.body, userId: req.user._id });
    sendSuccess(res, target, 'Target created', 201);
  } catch { sendError(res, 'Failed to create target'); }
};

export const updateTarget = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const target = await Target.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!target) { sendError(res, 'Target not found', 404); return; }
    sendSuccess(res, target, 'Target updated');
  } catch { sendError(res, 'Failed to update target'); }
};

export const deleteTarget = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Target.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    sendSuccess(res, null, 'Target deleted');
  } catch { sendError(res, 'Failed to delete target'); }
};