import mongoose, { Schema, Document } from 'mongoose';

export interface IBrandIdentity extends Document {
  brandName: string;
  tone: string; // e.g., "Professional yet witty", "Luxury and minimalist"
  targetAudience: string;
  coreValues: string[];
  productUVP: string; // Unique Value Proposition
  hashtags: string[];
  updatedAt: Date;
}

const BrandIdentitySchema: Schema = new Schema({
  brandName: { type: String, default: 'Peura Opticals' },
  tone: { type: String, default: 'Elegant, modern, and high-fashion' },
  targetAudience: { type: String, default: 'Urban professionals and fashion-forward individuals' },
  coreValues: { type: [String], default: ['Quality', 'Style', 'Clarity'] },
  productUVP: { type: String, default: 'Premium acetate frames with advanced blue-light blocking technology' },
  hashtags: { type: [String], default: ['#PeuraStyle', '#ClearVision', '#LuxuryEyewear'] },
}, { timestamps: true });

export default mongoose.model<IBrandIdentity>('BrandIdentity', BrandIdentitySchema);
