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
import { Expense, IExpense } from '../models/Expense';

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

const sumAmounts = (expenses: Pick<IExpense, 'amount'>[]): number =>
  expenses.reduce((sum, e) => sum + e.amount, 0);

export const calculateStats = async (): Promise<ExpenseStats> => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [todayExpenses, weekExpenses, monthExpenses, allExpenses] =
    await Promise.all([
      Expense.find({ date: { $gte: todayStart, $lte: todayEnd } }),
      Expense.find({ date: { $gte: weekStart, $lte: weekEnd } }),
      Expense.find({ date: { $gte: monthStart, $lte: monthEnd } }),
      Expense.find(),
    ]);

  const categoryMap = new Map<string, number>();
  for (const expense of allExpenses) {
    categoryMap.set(
      expense.category,
      (categoryMap.get(expense.category) || 0) + expense.amount
    );
  }

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const monthlyTrend: MonthlyTrendPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const mStart = startOfMonth(monthDate);
    const mEnd = endOfMonth(monthDate);
    const monthExpensesData = await Expense.find({
      date: { $gte: mStart, $lte: mEnd },
    });
    monthlyTrend.push({
      month: format(monthDate, 'MMM yyyy'),
      amount: sumAmounts(monthExpensesData),
    });
  }

  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weeklyBreakdown: WeeklyBreakdownPoint[] = weekDays.map((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const dayExpenses = weekExpenses.filter(
      (e) => e.date >= dayStart && e.date <= dayEnd
    );
    return {
      day: format(day, 'EEE'),
      amount: sumAmounts(dayExpenses),
    };
  });

  return {
    today: sumAmounts(todayExpenses),
    week: sumAmounts(weekExpenses),
    month: sumAmounts(monthExpenses),
    allTime: sumAmounts(allExpenses),
    categoryBreakdown,
    monthlyTrend,
    weeklyBreakdown,
  };
};
