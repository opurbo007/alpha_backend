import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error:', err);

  if (err.name === 'ValidationError') {
    sendError(res, 'Validation error', 400, err.message);
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    sendError(res, `${field} already in use`, 400);
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 'Invalid ID format', 400);
    return;
  }

  sendError(res, err.message || 'Server error', err.statusCode || 500);
};