import express from 'express';
import connectDB from '../lib/mongodb';
import Idea from '../models/Idea';

const router = express.Router();

// GET /api/idea/:id
router.get('/:id', async (req, res) => {
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
});

// PUT /api/idea/:id/update
router.put('/:id/update', async (req, res) => {
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
          isDraft: body.isDraft
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
});

export default router;
