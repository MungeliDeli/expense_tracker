import { Request, Response } from 'express';
import { Savings, SAVINGS_TYPES } from '../models/Savings';
import { getOrCreateSettings } from '../models/Settings';
import { calculateSavingsStats } from '../utils/savingsStats';

export const getSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      type,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (type && typeof type === 'string' && type !== 'all') {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) (filter.date as Record<string, Date>).$gte = new Date(startDate as string);
      if (endDate) (filter.date as Record<string, Date>).$lte = new Date(endDate as string);
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    const sortField = sortBy === 'amount' ? 'amount' : 'date';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [entries, total] = await Promise.all([
      Savings.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNum),
      Savings.countDocuments(filter),
    ]);

    res.json({
      savings: entries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get savings error:', error);
    res.status(500).json({ message: 'Failed to fetch savings' });
  }
};

export const getSavingsStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await calculateSavingsStats();
    res.json(stats);
  } catch (error) {
    console.error('Get savings stats error:', error);
    res.status(500).json({ message: 'Failed to fetch savings statistics' });
  }
};

export const getSavingsGoal = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ monthlyGoal: settings.monthlySavingsGoal });
  } catch (error) {
    console.error('Get savings goal error:', error);
    res.status(500).json({ message: 'Failed to fetch savings goal' });
  }
};

export const updateSavingsGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { monthlyGoal } = req.body;

    if (monthlyGoal === undefined || monthlyGoal < 0) {
      res.status(400).json({ message: 'Valid monthly goal is required' });
      return;
    }

    const settings = await getOrCreateSettings();
    settings.monthlySavingsGoal = Number(monthlyGoal);
    await settings.save();

    res.json({ monthlyGoal: settings.monthlySavingsGoal });
  } catch (error) {
    console.error('Update savings goal error:', error);
    res.status(500).json({ message: 'Failed to update savings goal' });
  }
};

export const createSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, type, description, date } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ message: 'Valid amount is required' });
      return;
    }

    if (!type || !SAVINGS_TYPES.includes(type)) {
      res.status(400).json({ message: 'Valid type is required (deposit or withdrawal)' });
      return;
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      res.status(400).json({ message: 'Description is required' });
      return;
    }

    if (!date) {
      res.status(400).json({ message: 'Date is required' });
      return;
    }

    const entry = await Savings.create({
      amount: Number(amount),
      type,
      description: description.trim(),
      date: new Date(date),
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create savings error:', error);
    res.status(500).json({ message: 'Failed to create savings entry' });
  }
};

export const updateSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, type, description, date } = req.body;

    const entry = await Savings.findById(id);
    if (!entry) {
      res.status(404).json({ message: 'Savings entry not found' });
      return;
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        res.status(400).json({ message: 'Valid amount is required' });
        return;
      }
      entry.amount = Number(amount);
    }

    if (type !== undefined) {
      if (!SAVINGS_TYPES.includes(type)) {
        res.status(400).json({ message: 'Valid type is required' });
        return;
      }
      entry.type = type;
    }

    if (description !== undefined) {
      if (!description.trim()) {
        res.status(400).json({ message: 'Description is required' });
        return;
      }
      entry.description = description.trim();
    }

    if (date !== undefined) {
      entry.date = new Date(date);
    }

    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error('Update savings error:', error);
    res.status(500).json({ message: 'Failed to update savings entry' });
  }
};

export const deleteSavings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const entry = await Savings.findByIdAndDelete(id);

    if (!entry) {
      res.status(404).json({ message: 'Savings entry not found' });
      return;
    }

    res.json({ message: 'Savings entry deleted successfully' });
  } catch (error) {
    console.error('Delete savings error:', error);
    res.status(500).json({ message: 'Failed to delete savings entry' });
  }
};
