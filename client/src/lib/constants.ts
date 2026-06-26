import type { ExpenseCategory, IncomeSource } from '../types';

export const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Airtime',
  'Internet',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

export const INCOME_SOURCES: IncomeSource[] = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Gifts',
  'Refunds',
  'Other',
];

export const SAVINGS_TYPES = ['deposit', 'withdrawal'] as const;

export const EXPENSE_TYPES = [
  { value: 'day-to-day' as const, label: 'Day-to-Day', description: 'Regular spending (counts toward daily budget)' },
  { value: 'planned' as const, label: 'Planned Purchase', description: 'Large one-off purchases (e.g. shoes, gadgets)' },
];

export const DAILY_BUDGET = 100;
export const WEEKLY_BUDGET = 700;
export const MONTHLY_BUDGET = 3000;

/** Income charts lean into success/accent tones for visual distinction */
export const INCOME_CHART_COLORS = [
  'rgb(var(--success))',
  'rgb(var(--accent))',
  'rgb(var(--primary-light))',
  'rgb(var(--glow-color))',
  'rgb(var(--blob-2))',
  'rgb(var(--warning))',
  'rgb(var(--primary))',
  'rgb(var(--blob-3))',
];

/** All chart colors derive from theme CSS variables */
export const CHART_COLORS = [
  'rgb(var(--primary))',
  'rgb(var(--accent))',
  'rgb(var(--primary-light))',
  'rgb(var(--success))',
  'rgb(var(--warning))',
  'rgb(var(--danger))',
  'rgb(var(--glow-color))',
  'rgb(var(--particle-color))',
  'rgb(var(--blob-2))',
  'rgb(var(--blob-3))',
];
