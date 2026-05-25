import { Response } from 'express';
import { Note } from '../models/Note.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, categoryId, tag } = req.query;
    const filter: any = { userId: req.user._id };
    if (categoryId) filter.categoryId = categoryId;
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search as string };
    const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
    sendSuccess(res, notes);
  } catch { sendError(res, 'Failed to get notes'); }
};

export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.create({ ...req.body, userId: req.user._id });
    sendSuccess(res, note, 'Note created', 201);
  } catch { sendError(res, 'Failed to create note'); }
};

export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!note) { sendError(res, 'Note not found', 404); return; }
    sendSuccess(res, note, 'Note updated');
  } catch { sendError(res, 'Failed to update note'); }
};

export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    sendSuccess(res, null, 'Note deleted');
  } catch { sendError(res, 'Failed to delete note'); }
};

export const togglePin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) { sendError(res, 'Note not found', 404); return; }
    note.pinned = !note.pinned;
    await note.save();
    sendSuccess(res, note, 'Pin toggled');
  } catch { sendError(res, 'Failed to toggle pin'); }
};