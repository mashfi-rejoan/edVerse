import express from 'express';
import { register, login, refreshToken, getProfile, forgotPassword, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);

export default router;
