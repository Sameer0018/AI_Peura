import mongoose, { Schema, Document } from 'mongoose';

export interface IVisualPrompt extends Document {
  title: string;
  type: 'Video' | 'Image' | 'Carousel';
  prompt: string;
  negativePrompt?: string;
  settings?: any;
  createdAt: Date;
}

const VisualPromptSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Video', 'Image', 'Carousel'], required: true },
  prompt: { type: String, required: true },
  negativePrompt: { type: String },
  settings: { type: Object },
}, { timestamps: true });

export default mongoose.model<IVisualPrompt>('VisualPrompt', VisualPromptSchema);
