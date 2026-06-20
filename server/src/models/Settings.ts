import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  monthlySavingsGoal: number;
}

const settingsSchema = new Schema<ISettings>({
  monthlySavingsGoal: { type: Number, default: 0, min: 0 },
});

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);

export const getOrCreateSettings = async (): Promise<ISettings> => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ monthlySavingsGoal: 0 });
  }
  return settings;
};
