import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  publishDate: Date;
  metaDescription: string;
  focusKeyword: string;
  readTime: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true, default: 'Style Guide' },
  tags: { type: [String], default: [] },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  author: { type: String, default: 'Peura Editorial' },
  publishDate: { type: Date, default: Date.now },
  metaDescription: { type: String },
  focusKeyword: { type: String },
  readTime: { type: String },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', BlogSchema);
