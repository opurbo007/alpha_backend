import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) { sendError(res, 'Email already registered', 400); return; }

    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await User.findByIdAndUpdate(user._id, { refreshToken });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch(console.error);

    sendSuccess(res, {
      user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
      token: accessToken,
      refreshToken,
    }, 'Account created successfully', 201);
  } catch (err) {
    sendError(res, 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      sendError(res, 'Invalid email or password', 401); return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await User.findByIdAndUpdate(user._id, { refreshToken });

    sendSuccess(res, {
      user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
      token: accessToken,
      refreshToken,
    }, 'Login successful');
  } catch {
    sendError(res, 'Login failed', 500);
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) { sendError(res, 'Refresh token required', 401); return; }

    const decoded = verifyRefreshToken(refreshToken) as { id: string };
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      sendError(res, 'Invalid refresh token', 401); return;
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    sendSuccess(res, { token: newAccessToken }, 'Token refreshed');
  } catch {
    sendError(res, 'Token refresh failed', 401);
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    sendSuccess(res, null, 'Logged out successfully');
  } catch {
    sendError(res, 'Logout failed', 500);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) { sendSuccess(res, null, 'If that email exists, a reset link was sent'); return; }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + Number(process.env.RESET_TOKEN_EXPIRES));

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    await sendPasswordResetEmail(user.email, user.name, token);
    sendSuccess(res, null, 'Password reset email sent');
  } catch {
    sendError(res, 'Could not send reset email', 500);
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) { sendError(res, 'Token invalid or expired', 400); return; }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendSuccess(res, null, 'Password reset successful');
  } catch {
    sendError(res, 'Password reset failed', 500);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  sendSuccess(res, {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
};