import { Router } from 'express';
import {
  getSavings,
  getSavingsStats,
  getSavingsGoal,
  updateSavingsGoal,
  createSavings,
  updateSavings,
  deleteSavings,
} from '../controllers/savingsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', getSavingsStats);
router.get('/goal', getSavingsGoal);
router.put('/goal', updateSavingsGoal);
router.get('/', getSavings);
router.post('/', createSavings);
router.put('/:id', updateSavings);
router.delete('/:id', deleteSavings);

export default router;
