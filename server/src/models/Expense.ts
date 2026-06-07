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

export interface IExpense extends Document {
  amount: number;
  category: ExpenseCategory;
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
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);
