import mongoose, { Document, Schema } from 'mongoose';

export const SAVINGS_TYPES = ['deposit', 'withdrawal'] as const;
export type SavingsType = (typeof SAVINGS_TYPES)[number];

export interface ISavings extends Document {
  amount: number;
  type: SavingsType;
  description: string;
  date: Date;
  createdAt: Date;
}

const savingsSchema = new Schema<ISavings>(
  {
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: SAVINGS_TYPES },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

savingsSchema.index({ date: -1 });
savingsSchema.index({ type: 1 });

export const Savings = mongoose.model<ISavings>('Savings', savingsSchema);
