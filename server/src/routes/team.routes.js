import { Router } from 'express';
import {
  inviteTeamMember, teamLogin, listTeamMembers,
  updateTeamMember, deleteTeamMember, getActivityLog,
} from '../controllers/team.controller.js';
import { authenticate, authorizeRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

// Public — team member login
router.post('/login', validate({
  email: { required: true, type: 'email' },
  password: { required: true, min: 8 },
}), teamLogin);

// Authenticated routes
router.post('/invite', authenticate, authorizeRole('owner', 'admin'), validate({
  name: { required: true },
  email: { required: true, type: 'email' },
  password: { required: true, min: 8 },
}), inviteTeamMember);

router.get('/members', authenticate, listTeamMembers);
router.put('/members/:id', authenticate, authorizeRole('owner', 'admin'), updateTeamMember);
router.delete('/members/:id', authenticate, authorizeRole('owner', 'admin'), deleteTeamMember);
router.get('/activity-log', authenticate, getActivityLog);

export default router;
