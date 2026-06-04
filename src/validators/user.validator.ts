import { body } from 'express-validator';

export const alphaLifeSettingsValidator = [
  body('signInDurationDays')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Sign-in duration must be between 1 and 365 days'),
  body('notificationTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('Notification time must be in HH:mm format'),
];
