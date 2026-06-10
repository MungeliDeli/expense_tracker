import { Request, Response } from 'express';
import { calculateDashboardStats } from '../utils/dashboardStats';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await calculateDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
};
