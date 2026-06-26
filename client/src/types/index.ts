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

export type ExpenseType = 'day-to-day' | 'planned';

export interface Expense {
  _id: string;
  amount: number;
  category: ExpenseCategory;
  expenseType: ExpenseType;
  description: string;
  date: string;
  createdAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory | '';
  expenseType: ExpenseType | '';
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
  expenseType: string;
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

export interface PeriodSnapshot {
  income: number;
  expenses: number;
  dayToDayExpenses: number;
  plannedExpenses: number;
  saved: number;
  remaining: number;
  net: number;
  spendingRatio: number;
  savingsRate: number;
  isHealthy: boolean;
}

export interface MonthlyComparisonPoint {
  month: string;
  income: number;
  expenses: number;
  saved: number;
  net: number;
}

export interface WeeklyComparisonPoint {
  day: string;
  income: number;
  expenses: number;
}

export interface MonthFocus {
  label: string;
  yearMonth: string;
  income: number;
  expenses: number;
  dayToDayExpenses: number;
  plannedExpenses: number;
  saved: number;
  remaining: number;
  net: number;
  savingsGoal: number;
  isSavingsOnTrack: boolean;
  savingsGoalProgress: number;
}

export interface BudgetStatus {
  limit: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isOnTrack: boolean;
}

export interface BudgetTracking {
  daily: BudgetStatus;
  weekly: BudgetStatus;
  monthly: BudgetStatus;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
}

export interface DashboardStats {
  selectedMonth: string;
  monthFocus: MonthFocus;
  previousMonth: MonthFocus;
  today: PeriodSnapshot;
  week: PeriodSnapshot;
  month: PeriodSnapshot;
  allTime: PeriodSnapshot;
  savingsBalance: number;
  monthlyComparison: MonthlyComparisonPoint[];
  weeklyComparison: WeeklyComparisonPoint[];
  categoryBreakdown: CategoryBreakdown[];
  sourceBreakdown: SourceBreakdown[];
  spendingCapPercent: number;
  budget: BudgetTracking;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export type SavingsType = 'deposit' | 'withdrawal';

export interface SavingsEntry {
  _id: string;
  amount: number;
  type: SavingsType;
  description: string;
  date: string;
  createdAt: string;
}

export interface SavingsFormData {
  amount: string;
  type: SavingsType | '';
  description: string;
  date: string;
}

export interface SavingsResponse {
  savings: SavingsEntry[];
  pagination: Pagination;
}

export interface SavingsMonthlyHistory {
  month: string;
  deposited: number;
  goal: number;
  isOnTrack: boolean;
}

export interface SavingsStats {
  balance: number;
  today: number;
  week: number;
  month: number;
  allTime: number;
  monthlyGoal: number;
  isGoalMet: boolean;
  goalProgress: number;
  monthlyHistory: SavingsMonthlyHistory[];
}

export interface SavingsFilters {
  search: string;
  type: string;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}
