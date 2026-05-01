import mongoose, { Schema, model, models } from 'mongoose';

export interface IIdea {
  title: string;
  description: string;
  link: string;
  competitor: string;
  contentType: 'Video' | 'Carousel' | 'Post' | 'Story';
  scheduledDate?: Date;
  isDraft: boolean;
  scrapedAt: Date;
  status: 'new' | 'approved' | 'ignored';
  videoUrl?: string;
  generationStatus?: 'none' | 'pending' | 'completed' | 'failed';
  generationCount?: number;
  script?: {
    hook: string;
    storyline: string;
    visualDirection: string;
    productFraming: string;
    cta: string;
    variations: { hook: string; angle: string }[];
    caption: string;
    hashtags: string[];
  };
}

const IdeaSchema = new Schema<IIdea>({
  title: { type: String, required: true },
  description: { type: String, required: false, default: '' },
  link: { type: String, required: true, unique: true },
  competitor: { type: String, required: true },
  contentType: { 
    type: String, 
    enum: ['Video', 'Carousel', 'Post', 'Story'], 
    default: 'Video' 
  },
  scheduledDate: { type: Date },
  isDraft: { type: Boolean, default: true },
  scrapedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['new', 'approved', 'ignored'], default: 'new' },
  videoUrl: { type: String },
  generationStatus: { 
    type: String, 
    enum: ['none', 'pending', 'completed', 'failed'], 
    default: 'none' 
  },
  generationCount: { type: Number, default: 0 },
  script: {
    hook: String,
    storyline: String,
    visualDirection: String,
    productFraming: String,
    cta: String,
    variations: [{ hook: String, angle: String }],
    caption: String,
    hashtags: [String],
  },
});

if (models.Idea) {
  delete (mongoose as any).models.Idea;
}
const Idea = model<IIdea>('Idea', IdeaSchema);

export default Idea;
