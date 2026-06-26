import { Request, Response } from 'express';
import { Expense, EXPENSE_CATEGORIES, EXPENSE_TYPES } from '../models/Expense';
import { calculateStats } from '../utils/stats';

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      expenseType,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (category && typeof category === 'string' && category !== 'all') {
      filter.category = category;
    }

    if (expenseType && typeof expenseType === 'string' && expenseType !== 'all') {
      filter.expenseType = expenseType;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) (filter.date as Record<string, Date>).$gte = new Date(startDate as string);
      if (endDate) (filter.date as Record<string, Date>).$lte = new Date(endDate as string);
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const sortField = sortBy === 'amount' ? 'amount' : 'date';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limitNum),
      Expense.countDocuments(filter),
    ]);

    res.json({
      expenses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await calculateStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, category, expenseType, description, date } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ message: 'Valid amount is required' });
      return;
    }

    if (!category || !EXPENSE_CATEGORIES.includes(category)) {
      res.status(400).json({ message: 'Valid category is required' });
      return;
    }

    if (!expenseType || !EXPENSE_TYPES.includes(expenseType)) {
      res.status(400).json({ message: 'Valid expense type is required' });
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

    const expense = await Expense.create({
      amount: Number(amount),
      category,
      expenseType,
      description: description.trim(),
      date: new Date(date),
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Failed to create expense' });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, category, expenseType, description, date } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        res.status(400).json({ message: 'Valid amount is required' });
        return;
      }
      expense.amount = Number(amount);
    }

    if (category !== undefined) {
      if (!EXPENSE_CATEGORIES.includes(category)) {
        res.status(400).json({ message: 'Valid category is required' });
        return;
      }
      expense.category = category;
    }

    if (expenseType !== undefined) {
      if (!EXPENSE_TYPES.includes(expenseType)) {
        res.status(400).json({ message: 'Valid expense type is required' });
        return;
      }
      expense.expenseType = expenseType;
    }

    if (description !== undefined) {
      if (!description.trim()) {
        res.status(400).json({ message: 'Description is required' });
        return;
      }
      expense.description = description.trim();
    }

    if (date !== undefined) {
      expense.date = new Date(date);
    }

    await expense.save();
    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};
