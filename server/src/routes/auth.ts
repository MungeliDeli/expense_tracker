import { Router } from 'express';
import { login, logout, verify } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', authenticate, verify);

export default router;
