import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  passwordHash: string;
}

const adminSchema = new Schema<IAdmin>({
  passwordHash: { type: String, required: true },
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
