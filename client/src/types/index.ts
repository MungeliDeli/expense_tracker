export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Airtime'
  | 'Internet'
  | 'Utilities'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Other';

export interface Expense {
  _id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory | '';
  description: string;
  date: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExpensesResponse {
  expenses: Expense[];
  pagination: Pagination;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
}

export interface MonthlyTrendPoint {
  month: string;
  amount: number;
}

export interface WeeklyBreakdownPoint {
  day: string;
  amount: number;
}

export interface ExpenseStats {
  today: number;
  week: number;
  month: number;
  allTime: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrend: MonthlyTrendPoint[];
  weeklyBreakdown: WeeklyBreakdownPoint[];
}

export interface ExpenseFilters {
  search: string;
  category: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export type IncomeSource =
  | 'Salary'
  | 'Freelance'
  | 'Business'
  | 'Investment'
  | 'Rental'
  | 'Gifts'
  | 'Refunds'
  | 'Other';

export interface Income {
  _id: string;
  amount: number;
  source: IncomeSource;
  description: string;
  date: string;
  createdAt: string;
}

export interface IncomeFormData {
  amount: string;
  source: IncomeSource | '';
  description: string;
  date: string;
}

export interface IncomeResponse {
  income: Income[];
  pagination: Pagination;
}

export interface SourceBreakdown {
  source: string;
  amount: number;
}

export interface IncomeStats {
  today: number;
  week: number;
  month: number;
  allTime: number;
  sourceBreakdown: SourceBreakdown[];
  monthlyTrend: MonthlyTrendPoint[];
  weeklyBreakdown: WeeklyBreakdownPoint[];
}

export interface IncomeFilters {
  search: string;
  source: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
