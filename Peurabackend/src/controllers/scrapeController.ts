import { Request, Response } from 'express';
import connectDB from '../lib/mongodb';
import Idea from '../models/Idea';
import { scrapeCompetitor } from '../lib/scraper';
import { generateFinalizedScript } from '../lib/scriptWriter';
import { sendApprovalEmail } from '../lib/notifier';

export const scrapeNewIdeas = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const competitors = ['lenskart', 'johnJacobs', 'titanEyeplus'];
    let newIdeasCount = 0;

    const contentTypes: ('Video' | 'Carousel' | 'Post' | 'Story')[] = ['Video', 'Carousel', 'Post', 'Story'];
    
    // Get the latest scheduled date to continue the calendar
    const lastScheduled = await Idea.findOne({ scheduledDate: { $ne: null } }).sort({ scheduledDate: -1 });
    let nextDate = lastScheduled?.scheduledDate 
      ? new Date(new Date(lastScheduled.scheduledDate).getTime() + 24 * 60 * 60 * 1000)
      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // Start from tomorrow

    for (const comp of competitors) {
      const posts = await scrapeCompetitor(comp);
      for (const post of posts) {
        const exists = await Idea.findOne({ link: post.link });
        if (!exists) {
          const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
          const script = await generateFinalizedScript(post.title + " " + post.description, type);

          
          await Idea.create({
            ...post,
            contentType: type,
            imageUrl: post.imageUrl,
            scheduledDate: new Date(nextDate),
            isDraft: false,
            tokensUsed: script.tokensUsed || 0,
            script: {
              hook: script.hook,
              storyline: script.storyline,
              visualDirection: script.visualDirection,
              productFraming: script.productFraming,
              cta: script.cta,
              variations: script.variations,
              caption: script.caption,
              hashtags: script.hashtags,
            }
          });
          
          // Increment next date for the next item
          nextDate.setDate(nextDate.getDate() + 1);
          newIdeasCount++;
        }
      }
    }

    if (newIdeasCount > 0) {
      const latestIdeas = await Idea.find({}).sort({ scrapedAt: -1 }).limit(newIdeasCount);
      await sendApprovalEmail(latestIdeas);
    }

    return res.json({ message: `Scraping complete. Found ${newIdeasCount} new ideas.` });
  } catch (error: any) {
    console.error('API Scrape POST Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getScrapedIdeas = async (req: Request, res: Response) => {
    try {
        await connectDB();
        const ideas = await Idea.find({}).sort({ scrapedAt: -1 });
        return res.json(ideas);
    } catch (error: any) {
        console.error('API Scrape GET Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
