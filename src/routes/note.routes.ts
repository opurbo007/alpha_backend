import { Router } from 'express';
import { getNotes, createNote, updateNote, deleteNote, togglePin } from '../controllers/note.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { noteValidator } from '../validators/note.validator';

const router = Router();

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes (supports ?search=, ?categoryId=, ?tag=)
 *     tags: [Notes]
 *   post:
 *     summary: Create a note
 *     tags: [Notes]
 */
router.get('/', protect, getNotes);
router.post('/', protect, noteValidator, validate, createNote);
router.patch('/:id', protect, updateNote);
router.patch('/:id/pin', protect, togglePin);
router.delete('/:id', protect, deleteNote);

export default router;