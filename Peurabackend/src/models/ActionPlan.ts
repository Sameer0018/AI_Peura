import mongoose, { Schema, Document } from 'mongoose';

export interface IActionPlan extends Document {
  userId: string;
  completedTaskIds: string[];
  updatedAt: Date;
}

const ActionPlanSchema: Schema = new Schema({
  userId: { type: String, required: true, default: 'demo-user', unique: true },
  completedTaskIds: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model<IActionPlan>('ActionPlan', ActionPlanSchema);
