import { Router } from 'express';
import { signup, signin, me } from '../controllers/authController';
import { auth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/me', auth, me);

export default router;