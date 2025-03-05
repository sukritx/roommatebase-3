// server/routes/roomRouter.ts
import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  searchRooms,
} from '../controllers';
import { auth } from '../middleware';

const router = Router();

// Public routes
router.get('/', getRooms);
router.get('/search', searchRooms); // Add before /:id to prevent conflict
router.get('/:id', getRoomById);

// Protected routes
router.post('/', auth, createRoom);
router.put('/:id', auth, updateRoom);
router.delete('/:id', auth, deleteRoom);

export default router;