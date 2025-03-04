// server/routes/userRouter.ts
import { Router } from 'express';
import { getUsers, signup, signin } from '../controllers';

const router = Router();

router.get('/', getUsers);
router.post('/signup', signup);
router.post('/signin', signin);

export default router;