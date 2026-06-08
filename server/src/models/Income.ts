import mongoose, { Document, Schema } from 'mongoose';

export const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Gifts',
  'Refunds',
  'Other',
] as const;

export type IncomeSource = (typeof INCOME_SOURCES)[number];

export interface IIncome extends Document {
  amount: number;
  source: IncomeSource;
  description: string;
  date: Date;
  createdAt: Date;
}

const incomeSchema = new Schema<IIncome>(
  {
    amount: { type: Number, required: true, min: 0 },
    source: {
      type: String,
      required: true,
      enum: INCOME_SOURCES,
    },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

incomeSchema.index({ date: -1 });
incomeSchema.index({ source: 1 });

export const Income = mongoose.model<IIncome>('Income', incomeSchema);
