// server/routes/userRouter.ts
import { Router } from 'express';
import { getUsers, signup, signin } from '../controllers';

const router = Router();

// Auth routes
router.post('/signin', signin);
router.post('/signup', signup);

// User routes
router.get('/:id', getUsers);

export default router;