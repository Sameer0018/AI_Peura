import express from 'express';
import VisualPrompt from '../models/VisualPrompt';

const router = express.Router();

// Get all prompts
router.get('/', async (req, res) => {
  try {
    const prompts = await VisualPrompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Save a prompt
router.post('/save', async (req, res) => {
  try {
    const { title, type, prompt, negativePrompt, settings } = req.body;
    const visualPrompt = new VisualPrompt({ title, type, prompt, negativePrompt, settings });
    await visualPrompt.save();
    res.json(visualPrompt);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
