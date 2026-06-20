import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  eachDayOfInterval,
  parse,
  isValid,
} from 'date-fns';
import { Expense } from '../models/Expense';
import { Income } from '../models/Income';
import { Savings } from '../models/Savings';
import { getOrCreateSettings } from '../models/Settings';
import {
  DAILY_SPENDING_BUDGET,
  WEEKLY_SPENDING_BUDGET,
  MONTHLY_SPENDING_BUDGET,
  buildBudgetStatus,
  type BudgetStatus,
} from './budgetConstants';

export const SPENDING_CAP_PERCENT = 20;

export interface PeriodSnapshot {
  income: number;
  expenses: number;
  saved: number;
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
  saved: number;
  net: number;
  savingsGoal: number;
  isSavingsOnTrack: boolean;
  savingsGoalProgress: number;
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
  categoryBreakdown: { category: string; amount: number }[];
  sourceBreakdown: { source: string; amount: number }[];
  spendingCapPercent: number;
  budget: BudgetTracking;
}

const sumInRange = async (
  model: typeof Expense | typeof Income,
  start: Date,
  end: Date,
): Promise<number> => {
  const [result] = await model.aggregate<{ total: number }>([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result?.total ?? 0;
};

const sumSavingsDeposits = async (start: Date, end: Date): Promise<number> => {
  const [result] = await Savings.aggregate<{ total: number }>([
    { $match: { type: 'deposit', date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result?.total ?? 0;
};

const getSavingsBalance = async (): Promise<number> => {
  const [deposits, withdrawals] = await Promise.all([
    Savings.aggregate<{ total: number }>([
      { $match: { type: 'deposit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Savings.aggregate<{ total: number }>([
      { $match: { type: 'withdrawal' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);
  return (deposits[0]?.total ?? 0) - (withdrawals[0]?.total ?? 0);
};

const buildSnapshot = (income: number, expenses: number, saved: number): PeriodSnapshot => {
  const net = income - expenses;
  const spendingRatio = income > 0 ? (expenses / income) * 100 : expenses > 0 ? 100 : 0;
  const savingsRate = income > 0 ? (saved / income) * 100 : 0;

  return {
    income,
    expenses,
    saved,
    net,
    spendingRatio,
    savingsRate,
    isHealthy: income > 0 ? spendingRatio <= SPENDING_CAP_PERCENT : expenses === 0,
  };
};

const buildMonthFocus = async (
  monthDate: Date,
  savingsGoal: number,
): Promise<MonthFocus> => {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const [income, expenses, saved] = await Promise.all([
    sumInRange(Income, start, end),
    sumInRange(Expense, start, end),
    sumSavingsDeposits(start, end),
  ]);

  const goalProgress = savingsGoal > 0 ? Math.min((saved / savingsGoal) * 100, 100) : saved > 0 ? 100 : 0;

  return {
    label: format(monthDate, 'MMMM yyyy'),
    yearMonth: format(monthDate, 'yyyy-MM'),
    income,
    expenses,
    saved,
    net: income - expenses,
    savingsGoal,
    isSavingsOnTrack: savingsGoal > 0 ? saved >= savingsGoal : saved > 0,
    savingsGoalProgress: goalProgress,
  };
};

const groupByMonth = async (
  model: typeof Expense | typeof Income,
  rangeStart: Date,
  rangeEnd: Date,
): Promise<Map<string, number>> => {
  const rows = await model.aggregate<{ _id: { y: number; m: number }; total: number }>([
    { $match: { date: { $gte: rangeStart, $lte: rangeEnd } } },
    {
      $group: {
        _id: { y: { $year: '$date' }, m: { $month: '$date' } },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(`${row._id.y}-${row._id.m}`, row.total);
  }
  return map;
};

const groupSavingsByMonth = async (
  rangeStart: Date,
  rangeEnd: Date,
): Promise<Map<string, number>> => {
  const rows = await Savings.aggregate<{ _id: { y: number; m: number }; total: number }>([
    { $match: { type: 'deposit', date: { $gte: rangeStart, $lte: rangeEnd } } },
    {
      $group: {
        _id: { y: { $year: '$date' }, m: { $month: '$date' } },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(`${row._id.y}-${row._id.m}`, row.total);
  }
  return map;
};

const parseMonthParam = (monthParam?: string): Date => {
  if (!monthParam) return new Date();
  const parsed = parse(monthParam, 'yyyy-MM', new Date());
  return isValid(parsed) ? parsed : new Date();
};

export const calculateDashboardStats = async (monthParam?: string): Promise<DashboardStats> => {
  const now = new Date();
  const selectedDate = parseMonthParam(monthParam);
  const previousDate = subMonths(selectedDate, 1);

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const sixMonthsAgo = startOfMonth(subMonths(now, 5));
  const sixMonthsEnd = endOfMonth(now);

  const settings = await getOrCreateSettings();
  const savingsGoal = settings.monthlySavingsGoal;

  const [
    todayIncome,
    todayExpenses,
    weekIncome,
    weekExpenses,
    monthIncome,
    monthExpenses,
    allIncome,
    allExpenses,
    todaySaved,
    weekSaved,
    monthSaved,
    allSaved,
    savingsBalance,
    expenseByMonth,
    incomeByMonth,
    savingsByMonth,
    categoryBreakdown,
    sourceBreakdown,
    weekIncomeRows,
    weekExpenseRows,
    monthFocus,
    previousMonth,
  ] = await Promise.all([
    sumInRange(Income, todayStart, todayEnd),
    sumInRange(Expense, todayStart, todayEnd),
    sumInRange(Income, weekStart, weekEnd),
    sumInRange(Expense, weekStart, weekEnd),
    sumInRange(Income, monthStart, monthEnd),
    sumInRange(Expense, monthStart, monthEnd),
    sumInRange(Income, new Date(0), now),
    sumInRange(Expense, new Date(0), now),
    sumSavingsDeposits(todayStart, todayEnd),
    sumSavingsDeposits(weekStart, weekEnd),
    sumSavingsDeposits(monthStart, monthEnd),
    sumSavingsDeposits(new Date(0), now),
    getSavingsBalance(),
    groupByMonth(Expense, sixMonthsAgo, sixMonthsEnd),
    groupByMonth(Income, sixMonthsAgo, sixMonthsEnd),
    groupSavingsByMonth(sixMonthsAgo, sixMonthsEnd),
    Expense.aggregate<{ _id: string; total: number }>([
      { $match: { date: { $gte: startOfMonth(selectedDate), $lte: endOfMonth(selectedDate) } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Income.aggregate<{ _id: string; total: number }>([
      { $match: { date: { $gte: startOfMonth(selectedDate), $lte: endOfMonth(selectedDate) } } },
      { $group: { _id: '$source', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Income.aggregate<{ _id: string; total: number }>([
      { $match: { date: { $gte: weekStart, $lte: weekEnd } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
    ]),
    Expense.aggregate<{ _id: string; total: number }>([
      { $match: { date: { $gte: weekStart, $lte: weekEnd } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
    ]),
    buildMonthFocus(selectedDate, savingsGoal),
    buildMonthFocus(previousDate, savingsGoal),
  ]);

  const incomeDayMap = new Map(weekIncomeRows.map((r) => [r._id, r.total]));
  const expenseDayMap = new Map(weekExpenseRows.map((r) => [r._id, r.total]));

  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weeklyComparison: WeeklyComparisonPoint[] = weekDays.map((day) => {
    const key = format(day, 'yyyy-MM-dd');
    return {
      day: format(day, 'EEE'),
      income: incomeDayMap.get(key) ?? 0,
      expenses: expenseDayMap.get(key) ?? 0,
    };
  });

  const monthlyComparison: MonthlyComparisonPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const key = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
    const income = incomeByMonth.get(key) ?? 0;
    const expenses = expenseByMonth.get(key) ?? 0;
    const saved = savingsByMonth.get(key) ?? 0;
    monthlyComparison.push({
      month: format(monthDate, 'MMM yyyy'),
      income,
      expenses,
      saved,
      net: income - expenses,
    });
  }

  const budget: BudgetTracking = {
    daily: buildBudgetStatus(todayExpenses, DAILY_SPENDING_BUDGET),
    weekly: buildBudgetStatus(weekExpenses, WEEKLY_SPENDING_BUDGET),
    monthly: buildBudgetStatus(monthExpenses, MONTHLY_SPENDING_BUDGET),
    dailyLimit: DAILY_SPENDING_BUDGET,
    weeklyLimit: WEEKLY_SPENDING_BUDGET,
    monthlyLimit: MONTHLY_SPENDING_BUDGET,
  };

  return {
    selectedMonth: format(selectedDate, 'yyyy-MM'),
    monthFocus,
    previousMonth,
    today: buildSnapshot(todayIncome, todayExpenses, todaySaved),
    week: buildSnapshot(weekIncome, weekExpenses, weekSaved),
    month: buildSnapshot(monthIncome, monthExpenses, monthSaved),
    allTime: buildSnapshot(allIncome, allExpenses, allSaved),
    savingsBalance,
    monthlyComparison,
    weeklyComparison,
    categoryBreakdown: categoryBreakdown.map((r) => ({
      category: r._id,
      amount: r.total,
    })),
    sourceBreakdown: sourceBreakdown.map((r) => ({
      source: r._id,
      amount: r.total,
    })),
    spendingCapPercent: SPENDING_CAP_PERCENT,
    budget,
  };
};
