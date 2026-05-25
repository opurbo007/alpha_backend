import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../models/User.model';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Not authorized. No token.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      sendError(res, 'User not found.', 401);
      return;
    }

    req.user = user;
    next();
  } catch {
    sendError(res, 'Token invalid or expired.', 401);
  }
};