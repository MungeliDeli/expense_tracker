import { Request, Response } from 'express';
import { calculateDashboardStats } from '../utils/dashboardStats';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const month = typeof req.query.month === 'string' ? req.query.month : undefined;
    const stats = await calculateDashboardStats(month);
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
};
