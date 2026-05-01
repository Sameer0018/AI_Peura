import express from 'express';
import { scrapeNewIdeas, getScrapedIdeas } from '../controllers/scrapeController';

const router = express.Router();

/**
 * @swagger
 * /api/scrape:
 *   post:
 *     summary: Scrape new ideas
 *     description: Triggers a scraping job to gather new content ideas from competitors and automatically schedule them.
 *     responses:
 *       200:
 *         description: Successfully scraped new ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/', scrapeNewIdeas);

/**
 * @swagger
 * /api/scrape:
 *   get:
 *     summary: Get all scraped ideas
 *     description: Retrieves the entire list of scraped ideas sorted by the newest first.
 *     responses:
 *       200:
 *         description: Successfully retrieved list of ideas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get('/', getScrapedIdeas);

export default router;
