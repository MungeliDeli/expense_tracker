export const DAILY_SPENDING_BUDGET = 100;
export const WEEKLY_SPENDING_BUDGET = 700;
export const MONTHLY_SPENDING_BUDGET = 3000;

export interface BudgetStatus {
  limit: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  isOnTrack: boolean;
}

export const buildBudgetStatus = (spent: number, limit: number): BudgetStatus => ({
  limit,
  spent,
  remaining: Math.max(limit - spent, 0),
  percentUsed: limit > 0 ? Math.min((spent / limit) * 100, 100) : spent > 0 ? 100 : 0,
  isOnTrack: spent <= limit,
});
