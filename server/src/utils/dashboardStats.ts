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
} from 'date-fns';
import { Expense } from '../models/Expense';
import { Income } from '../models/Income';

export const SPENDING_CAP_PERCENT = 20;

export interface PeriodSnapshot {
  income: number;
  expenses: number;
  net: number;
  spendingRatio: number;
  savingsRate: number;
  isHealthy: boolean;
}

export interface MonthlyComparisonPoint {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface WeeklyComparisonPoint {
  day: string;
  income: number;
  expenses: number;
}

export interface DashboardStats {
  today: PeriodSnapshot;
  week: PeriodSnapshot;
  month: PeriodSnapshot;
  allTime: PeriodSnapshot;
  monthlyComparison: MonthlyComparisonPoint[];
  weeklyComparison: WeeklyComparisonPoint[];
  categoryBreakdown: { category: string; amount: number }[];
  sourceBreakdown: { source: string; amount: number }[];
  spendingCapPercent: number;
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

const buildSnapshot = (income: number, expenses: number): PeriodSnapshot => {
  const net = income - expenses;
  const spendingRatio = income > 0 ? (expenses / income) * 100 : expenses > 0 ? 100 : 0;
  const savingsRate = income > 0 ? (net / income) * 100 : 0;

  return {
    income,
    expenses,
    net,
    spendingRatio,
    savingsRate,
    isHealthy: income > 0 ? spendingRatio <= SPENDING_CAP_PERCENT : expenses === 0,
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

export const calculateDashboardStats = async (): Promise<DashboardStats> => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const sixMonthsAgo = startOfMonth(subMonths(now, 5));
  const sixMonthsEnd = endOfMonth(now);

  const [
    todayIncome,
    todayExpenses,
    weekIncome,
    weekExpenses,
    monthIncome,
    monthExpenses,
    allIncome,
    allExpenses,
    expenseByMonth,
    incomeByMonth,
    categoryBreakdown,
    sourceBreakdown,
    weekIncomeRows,
    weekExpenseRows,
  ] = await Promise.all([
    sumInRange(Income, todayStart, todayEnd),
    sumInRange(Expense, todayStart, todayEnd),
    sumInRange(Income, weekStart, weekEnd),
    sumInRange(Expense, weekStart, weekEnd),
    sumInRange(Income, monthStart, monthEnd),
    sumInRange(Expense, monthStart, monthEnd),
    sumInRange(Income, new Date(0), now),
    sumInRange(Expense, new Date(0), now),
    groupByMonth(Expense, sixMonthsAgo, sixMonthsEnd),
    groupByMonth(Income, sixMonthsAgo, sixMonthsEnd),
    Expense.aggregate<{ _id: string; total: number }>([
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Income.aggregate<{ _id: string; total: number }>([
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
    monthlyComparison.push({
      month: format(monthDate, 'MMM yyyy'),
      income,
      expenses,
      net: income - expenses,
    });
  }

  return {
    today: buildSnapshot(todayIncome, todayExpenses),
    week: buildSnapshot(weekIncome, weekExpenses),
    month: buildSnapshot(monthIncome, monthExpenses),
    allTime: buildSnapshot(allIncome, allExpenses),
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
  };
};
