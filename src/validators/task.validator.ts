import { body } from 'express-validator';

export const taskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('priority')
    .optional()
    .isIn(['high', 'medium', 'low'])
    .withMessage('Priority must be high, medium, or low'),
  body('date').optional().isString(),
];