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
