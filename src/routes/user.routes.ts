import { Router } from 'express';
import { updateProfile, changePassword, deleteAccount } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.patch('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

export default router;