import { Router } from 'express';
import {
  getGoals, createGoal, updateGoal, deleteGoal,
  addMilestone, updateMilestone, deleteMilestone,
} from '../controllers/goal.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { goalValidator } from '../validators/goal.validator';

const router = Router();

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get all goals
 *     tags: [Goals]
 *   post:
 *     summary: Create a goal
 *     tags: [Goals]
 */
router.get('/', protect, getGoals);
router.post('/', protect, goalValidator, validate, createGoal);
router.patch('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);

// Milestones
router.post('/:id/milestones', protect, addMilestone);
router.patch('/:goalId/milestones/:milestoneId', protect, updateMilestone);
router.delete('/:goalId/milestones/:milestoneId', protect, deleteMilestone);

export default router;