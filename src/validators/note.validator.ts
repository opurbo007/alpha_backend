import { body } from 'express-validator';

export const noteValidator = [
  body('title').optional().isString(),
  body('content').optional().isString(),
  body('tags').optional().isArray(),
];