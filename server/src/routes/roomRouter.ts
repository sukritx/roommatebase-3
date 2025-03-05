// server/routes/roomRouter.ts
import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers';
import { auth } from '../middleware';

const router = Router();

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoomById);

// Protected routes
router.post('/', auth, createRoom);
router.put('/:id', auth, updateRoom);
router.delete('/:id', auth, deleteRoom);

export default router;