import { Router } from 'express';
import { createParty, joinParty, leaveParty } from '../controllers/partyController';
import { auth } from '../middleware';

const router = Router();

// All party routes require authentication
router.use(auth);

// Create a party for a room
router.post('/:roomId', createParty);

// Join an existing party
router.post('/:partyId/join', joinParty);

// Leave a party
router.post('/:partyId/leave', leaveParty);

export default router;