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
import { Income, IIncome } from '../models/Income';

export interface SourceBreakdown {
  source: string;
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

export interface IncomeStats {
  today: number;
  week: number;
  month: number;
  allTime: number;
  sourceBreakdown: SourceBreakdown[];
  monthlyTrend: MonthlyTrendPoint[];
  weeklyBreakdown: WeeklyBreakdownPoint[];
}

const sumAmounts = (items: Pick<IIncome, 'amount'>[]): number =>
  items.reduce((sum, e) => sum + e.amount, 0);

export const calculateIncomeStats = async (): Promise<IncomeStats> => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [todayIncome, weekIncome, monthIncome, allIncome] = await Promise.all([
    Income.find({ date: { $gte: todayStart, $lte: todayEnd } }),
    Income.find({ date: { $gte: weekStart, $lte: weekEnd } }),
    Income.find({ date: { $gte: monthStart, $lte: monthEnd } }),
    Income.find(),
  ]);

  const sourceMap = new Map<string, number>();
  for (const item of allIncome) {
    sourceMap.set(item.source, (sourceMap.get(item.source) || 0) + item.amount);
  }

  const sourceBreakdown = Array.from(sourceMap.entries())
    .map(([source, amount]) => ({ source, amount }))
    .sort((a, b) => b.amount - a.amount);

  const monthlyTrend: MonthlyTrendPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const mStart = startOfMonth(monthDate);
    const mEnd = endOfMonth(monthDate);
    const monthData = await Income.find({
      date: { $gte: mStart, $lte: mEnd },
    });
    monthlyTrend.push({
      month: format(monthDate, 'MMM yyyy'),
      amount: sumAmounts(monthData),
    });
  }

  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weeklyBreakdown: WeeklyBreakdownPoint[] = weekDays.map((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);
    const dayIncome = weekIncome.filter(
      (e) => e.date >= dayStart && e.date <= dayEnd
    );
    return {
      day: format(day, 'EEE'),
      amount: sumAmounts(dayIncome),
    };
  });

  return {
    today: sumAmounts(todayIncome),
    week: sumAmounts(weekIncome),
    month: sumAmounts(monthIncome),
    allTime: sumAmounts(allIncome),
    sourceBreakdown,
    monthlyTrend,
    weeklyBreakdown,
  };
};
