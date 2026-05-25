import { body } from 'express-validator';

export const goalValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'paused'])
    .withMessage('Invalid status'),
];

export const targetValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('period')
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Period must be daily, weekly, or monthly'),
  body('targetValue').isNumeric().withMessage('Target value must be a number'),
  body('unit').notEmpty().withMessage('Unit is required'),
];