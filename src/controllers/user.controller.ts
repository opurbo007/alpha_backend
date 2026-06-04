import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) { sendError(res, 'Email already in use', 400); return; }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    sendSuccess(res, user, 'Profile updated');
  } catch {
    sendError(res, 'Update failed', 500);
  }
};

export const updateAlphaLifeSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { signInDurationDays, notificationTime } = req.body;
    const alphaLifeSettings: Record<string, number | string> = {};

    if (signInDurationDays !== undefined) {
      alphaLifeSettings['alphaLifeSettings.signInDurationDays'] = Number(signInDurationDays);
    }

    if (notificationTime !== undefined) {
      alphaLifeSettings['alphaLifeSettings.notificationTime'] = notificationTime;
    }

    if (Object.keys(alphaLifeSettings).length === 0) {
      sendError(res, 'No alpha Life settings provided', 400);
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: alphaLifeSettings },
      { new: true, runValidators: true },
    );

    sendSuccess(res, user?.alphaLifeSettings, 'alpha Life settings updated');
  } catch {
    sendError(res, 'alpha Life settings update failed', 500);
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user || !(await user.comparePassword(currentPassword))) {
      sendError(res, 'Current password is incorrect', 401); return;
    }
    user.password = newPassword;
    await user.save();
    sendSuccess(res, null, 'Password changed successfully');
  } catch {
    sendError(res, 'Password change failed', 500);
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.user._id);
    sendSuccess(res, null, 'Account deleted');
  } catch {
    sendError(res, 'Delete failed', 500);
  }
};
