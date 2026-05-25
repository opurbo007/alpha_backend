import { Response } from 'express';
import { TimerSession } from '../models/TimerSession.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await TimerSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, sessions);
  } catch { sendError(res, 'Failed to get sessions'); }
};

export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const session = await TimerSession.create({ ...req.body, userId: req.user._id });
    sendSuccess(res, session, 'Session saved', 201);
  } catch { sendError(res, 'Failed to save session'); }
};

export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await TimerSession.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    sendSuccess(res, null, 'Session deleted');
  } catch { sendError(res, 'Failed to delete session'); }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await TimerSession.find({ userId: req.user._id });
    const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
    const byCategory = sessions.reduce((acc: any, s) => {
      acc[s.category] = (acc[s.category] || 0) + s.duration;
      return acc;
    }, {});
    sendSuccess(res, { totalSeconds, byCategory, count: sessions.length });
  } catch { sendError(res, 'Failed to get stats'); }
};