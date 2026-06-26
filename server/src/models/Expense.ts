import mongoose, { Document, Schema } from 'mongoose';

export const EXPENSE_CATEGORIES = [
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
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_TYPES = ['day-to-day', 'planned'] as const;

export type ExpenseType = (typeof EXPENSE_TYPES)[number];

export interface IExpense extends Document {
  amount: number;
  category: ExpenseCategory;
  expenseType: ExpenseType;
  description: string;
  date: Date;
  createdAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: EXPENSE_CATEGORIES,
    },
    expenseType: {
      type: String,
      required: true,
      enum: EXPENSE_TYPES,
      default: 'day-to-day',
    },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ expenseType: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
