import express from 'express';
import { register, login, refreshToken, getProfile, forgotPassword, logout, adminCreateUser } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/admin-create-user', authenticate, authorize('admin'), adminCreateUser);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);

export default router;
