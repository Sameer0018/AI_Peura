import { Request, Response } from 'express';
import connectDB from '../lib/mongodb';
import Idea from '../models/Idea';

export const getIdeaById = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    return res.json(idea);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateIdea = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const body = req.body;
    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          scheduledDate: body.scheduledDate,
          contentType: body.contentType,
          title: body.title,
          isDraft: body.isDraft,
          script: body.script,
          generationStatus: body.generationStatus
        } 

      },
      { new: true }
    );
    
    if (!updatedIdea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    return res.json(updatedIdea);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
