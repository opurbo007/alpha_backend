import { Router } from 'express';
import { getTargets, createTarget, updateTarget, deleteTarget } from '../controllers/target.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { targetValidator } from '../validators/goal.validator';

const router = Router();

router.get('/', protect, getTargets);
router.post('/', protect, targetValidator, validate, createTarget);
router.patch('/:id', protect, updateTarget);
router.delete('/:id', protect, deleteTarget);

export default router;