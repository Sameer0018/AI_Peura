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
    const updateObj: any = { $set: body };
    
    // If generationStatus is completed, increment the count
    if (body.generationStatus === 'completed') {
      updateObj.$inc = { generationCount: 1 };
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      updateObj,
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

export const createIdea = async (req: Request, res: Response) => {
  try {
    await connectDB();
    const body = req.body;
    const newIdea = await Idea.create(body);
    return res.status(201).json(newIdea);
  } catch (error: any) {
    console.error('Create Idea Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
