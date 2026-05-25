import { Router } from 'express';
import {
  getWorkouts, createWorkout, updateWorkout, deleteWorkout,
  getBodyStats, createBodyStat, deleteBodyStat,
} from '../controllers/fitness.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /fitness/workouts:
 *   get:
 *     summary: Get all workouts
 *     tags: [Fitness]
 *   post:
 *     summary: Log a workout
 *     tags: [Fitness]
 */
router.get('/workouts', protect, getWorkouts);
router.post('/workouts', protect, createWorkout);
router.patch('/workouts/:id', protect, updateWorkout);
router.delete('/workouts/:id', protect, deleteWorkout);

router.get('/body-stats', protect, getBodyStats);
router.post('/body-stats', protect, createBodyStat);
router.delete('/body-stats/:id', protect, deleteBodyStat);

export default router;