import { Router } from 'express';
import {
  getIncome,
  getIncomeStats,
  createIncome,
  updateIncome,
  deleteIncome,
} from '../controllers/incomeController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/stats', getIncomeStats);
router.get('/', getIncome);
router.post('/', createIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;
