import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from 'date-fns';
import { Savings } from '../models/Savings';
import { getOrCreateSettings } from '../models/Settings';

export interface SavingsStats {
  balance: number;
  today: number;
  week: number;
  month: number;
  allTime: number;
  monthlyGoal: number;
  isGoalMet: boolean;
  goalProgress: number;
  monthlyHistory: { month: string; deposited: number; goal: number; isOnTrack: boolean }[];
}

const sumDepositsInRange = async (start: Date, end: Date): Promise<number> => {
  const [deposits, withdrawals] = await Promise.all([
    Savings.aggregate<{ total: number }>([
      { $match: { type: 'deposit', date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Savings.aggregate<{ total: number }>([
      { $match: { type: 'withdrawal', date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);
  return (deposits[0]?.total ?? 0) - (withdrawals[0]?.total ?? 0);
};

const getBalance = async (): Promise<number> => {
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

const sumDepositsOnly = async (start: Date, end: Date): Promise<number> => {
  const [result] = await Savings.aggregate<{ total: number }>([
    { $match: { type: 'deposit', date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result?.total ?? 0;
};

export const calculateSavingsStats = async (): Promise<SavingsStats> => {
  const now = new Date();
  const settings = await getOrCreateSettings();
  const goal = settings.monthlySavingsGoal;

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [balance, today, week, month, allTime, monthlyHistory] = await Promise.all([
    getBalance(),
    sumDepositsInRange(todayStart, todayEnd),
    sumDepositsInRange(weekStart, weekEnd),
    sumDepositsOnly(monthStart, monthEnd),
    getBalance(),
    buildMonthlyHistory(now, goal),
  ]);

  const goalProgress = goal > 0 ? Math.min((month / goal) * 100, 100) : month > 0 ? 100 : 0;

  return {
    balance,
    today,
    week,
    month,
    allTime,
    monthlyGoal: goal,
    isGoalMet: goal > 0 ? month >= goal : month > 0,
    goalProgress,
    monthlyHistory,
  };
};

const buildMonthlyHistory = async (
  now: Date,
  goal: number,
): Promise<SavingsStats['monthlyHistory']> => {
  const history: SavingsStats['monthlyHistory'] = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const deposited = await sumDepositsOnly(start, end);
    history.push({
      month: format(monthDate, 'MMM yyyy'),
      deposited,
      goal,
      isOnTrack: goal > 0 ? deposited >= goal : deposited > 0,
    });
  }

  return history;
};

export const sumSavingsDepositsInRange = sumDepositsOnly;
