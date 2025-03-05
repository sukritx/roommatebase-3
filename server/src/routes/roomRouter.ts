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
  selectTenant,
  selectParty,
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

// Room owner actions
router.put('/:id/selectTenant', auth, selectTenant);
router.put('/:id/selectParty', auth, selectParty);

export default router;