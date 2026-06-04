import { Router } from 'express';
import { updateProfile, changePassword, deleteAccount, updateAlphaLifeSettings } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { alphaLifeSettingsValidator } from '../validators/user.validator';

const router = Router();

router.patch('/profile', protect, updateProfile);
router.patch('/alpha-life-settings', protect, alphaLifeSettingsValidator, validate, updateAlphaLifeSettings);
router.patch('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

export default router;
