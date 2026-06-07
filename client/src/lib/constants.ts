import type { ExpenseCategory } from '../types';

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
