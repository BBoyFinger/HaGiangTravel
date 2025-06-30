import { Router } from 'express';
import authController from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();



router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.post('/change-password', authMiddleware, authController.changePassword);
router.put('/profile', authMiddleware, authController.updateProfile);

export default router;
