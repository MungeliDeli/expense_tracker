import { Request, Response } from 'express';
import { Income, INCOME_SOURCES } from '../models/Income';
import { calculateIncomeStats } from '../utils/incomeStats';

export const getIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      source,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (source && typeof source === 'string' && source !== 'all') {
      filter.source = source;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) (filter.date as Record<string, Date>).$gte = new Date(startDate as string);
      if (endDate) (filter.date as Record<string, Date>).$lte = new Date(endDate as string);
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
      ];
    }

    const sortField = sortBy === 'amount' ? 'amount' : 'date';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [income, total] = await Promise.all([
      Income.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNum),
      Income.countDocuments(filter),
    ]);

    res.json({
      income,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ message: 'Failed to fetch income' });
  }
};

export const getIncomeStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await calculateIncomeStats();
    res.json(stats);
  } catch (error) {
    console.error('Get income stats error:', error);
    res.status(500).json({ message: 'Failed to fetch income statistics' });
  }
};

export const createIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, source, description, date } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ message: 'Valid amount is required' });
      return;
    }

    if (!source || !INCOME_SOURCES.includes(source)) {
      res.status(400).json({ message: 'Valid source is required' });
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

    const entry = await Income.create({
      amount: Number(amount),
      source,
      description: description.trim(),
      date: new Date(date),
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({ message: 'Failed to create income' });
  }
};

export const updateIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, source, description, date } = req.body;

    const entry = await Income.findById(id);
    if (!entry) {
      res.status(404).json({ message: 'Income entry not found' });
      return;
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        res.status(400).json({ message: 'Valid amount is required' });
        return;
      }
      entry.amount = Number(amount);
    }

    if (source !== undefined) {
      if (!INCOME_SOURCES.includes(source)) {
        res.status(400).json({ message: 'Valid source is required' });
        return;
      }
      entry.source = source;
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
    console.error('Update income error:', error);
    res.status(500).json({ message: 'Failed to update income' });
  }
};

export const deleteIncome = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const entry = await Income.findByIdAndDelete(id);

    if (!entry) {
      res.status(404).json({ message: 'Income entry not found' });
      return;
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({ message: 'Failed to delete income' });
  }
};
