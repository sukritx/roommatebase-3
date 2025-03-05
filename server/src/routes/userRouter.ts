// server/routes/userRouter.ts
import { Router } from 'express';
import {
  getUsers,
  getUserProfile,
  updateUserProfile,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from '../controllers';
import { auth } from '../middleware';

const router = Router();

// Protected routes
router.get('/', auth, getUsers);
router.get('/:id', auth, getUserProfile);
router.put('/:id', auth, updateUserProfile);
router.get('/favorites', auth, getFavorites);
router.post('/favorites/:roomId', auth, addToFavorites);
router.delete('/favorites/:roomId', auth, removeFromFavorites);

export default router;