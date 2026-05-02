import express from 'express';
import BrandIdentity from '../models/BrandIdentity';

const router = express.Router();

// Get Brand Identity (singleton approach for now)
router.get('/', async (req, res) => {
  try {
    let identity = await BrandIdentity.findOne();
    if (!identity) {
      identity = new BrandIdentity();
      await identity.save();
    }
    res.json(identity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Brand Identity
router.post('/update', async (req, res) => {
  try {
    const { tone, targetAudience, coreValues, productUVP, hashtags } = req.body;
    let identity = await BrandIdentity.findOne();
    if (!identity) {
      identity = new BrandIdentity({ tone, targetAudience, coreValues, productUVP, hashtags });
    } else {
      identity.tone = tone;
      identity.targetAudience = targetAudience;
      identity.coreValues = coreValues;
      identity.productUVP = productUVP;
      identity.hashtags = hashtags;
    }
    await identity.save();
    res.json(identity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
