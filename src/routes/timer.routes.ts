import { Router } from 'express';
import { getSessions, createSession, deleteSession, getStats } from '../controllers/timer.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /timers:
 *   get:
 *     summary: Get all timer sessions
 *     tags: [Timers]
 *   post:
 *     summary: Save a timer session
 *     tags: [Timers]
 */
router.get('/', protect, getSessions);
router.get('/stats', protect, getStats);
router.post('/', protect, createSession);
router.delete('/:id', protect, deleteSession);

export default router;