import express from 'express';
import FAQ from '../models/FAQ';

const router = express.Router();

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create an FAQ
router.post('/create', async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const faq = new FAQ({ question, answer, category });
    await faq.save();
    res.json(faq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an FAQ
router.delete('/:id', async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
