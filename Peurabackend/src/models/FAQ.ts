import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IFAQ>('FAQ', FAQSchema);
