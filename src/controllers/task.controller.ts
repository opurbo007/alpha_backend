import { Response } from 'express';
import { Task } from '../models/Task.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date } = req.query;
    const filter: any = { userId: req.user._id };
    if (date) filter.date = date;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, tasks);
  } catch { sendError(res, 'Failed to get tasks'); }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user._id });
    sendSuccess(res, task, 'Task created', 201);
  } catch { sendError(res, 'Failed to create task'); }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) { sendError(res, 'Task not found', 404); return; }
    sendSuccess(res, task, 'Task updated');
  } catch { sendError(res, 'Failed to update task'); }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) { sendError(res, 'Task not found', 404); return; }
    sendSuccess(res, null, 'Task deleted');
  } catch { sendError(res, 'Failed to delete task'); }
};

export const bulkCreateTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = req.body.tasks.map((t: any) => ({ ...t, userId: req.user._id }));
    const created = await Task.insertMany(tasks);
    sendSuccess(res, created, 'Tasks synced', 201);
  } catch { sendError(res, 'Failed to sync tasks'); }
};