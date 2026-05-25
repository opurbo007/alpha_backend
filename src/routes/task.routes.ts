import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, bulkCreateTasks } from '../controllers/task.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { taskValidator } from '../validators/task.validator';

const router = Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (optionally filter by ?date=YYYY-MM-DD)
 *     tags: [Tasks]
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 */
router.get('/', protect, getTasks);
router.post('/', protect, taskValidator, validate, createTask);
router.post('/bulk', protect, bulkCreateTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 */
router.patch('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;