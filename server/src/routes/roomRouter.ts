// server/routes/roomRouter.ts
import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  searchRooms,
  applyForRoom,
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
router.post('/:id/apply', auth, applyForRoom);

export default router;