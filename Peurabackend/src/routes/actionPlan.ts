import express from 'express';
import ActionPlan from '../models/ActionPlan';

const router = express.Router();

// Get the action plan state
router.get('/:userId', async (req, res) => {
  try {
    let plan = await ActionPlan.findOne({ userId: req.params.userId });
    if (!plan) {
      plan = new ActionPlan({ userId: req.params.userId, completedTaskIds: [] });
      await plan.save();
    }
    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update the action plan state
router.post('/update', async (req, res) => {
  try {
    const { userId, completedTaskIds } = req.body;
    const plan = await ActionPlan.findOneAndUpdate(
      { userId },
      { completedTaskIds },
      { new: true, upsert: true }
    );
    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
