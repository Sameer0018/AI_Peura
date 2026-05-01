import express from 'express';
import { getIdeaById, updateIdea, createIdea } from '../controllers/ideaController';

const router = express.Router();

/**
 * @swagger
 * /api/idea/{id}:
 *   get:
 *     summary: Retrieve a single idea by ID
 *     description: Fetches the details of a specific content idea.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the idea
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved idea
 *       404:
 *         description: Idea not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getIdeaById);

/**
 * @swagger
 * /api/idea/{id}/update:
 *   put:
 *     summary: Update an idea
 *     description: Updates the scheduled date, content type, title, and draft status of an idea.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the idea
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               contentType:
 *                 type: string
 *                 enum: [Video, Carousel, Post, Story]
 *               title:
 *                 type: string
 *               isDraft:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated idea
 *       404:
 *         description: Idea not found
 *       500:
 *         description: Server error
 */
router.put('/:id/update', updateIdea);

/**
 * @swagger
 * /api/idea/create:
 *   post:
 *     summary: Create a new idea record
 *     description: Creates a new entry in the database, used for saving newly generated content without overwriting the original idea.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Successfully created idea
 *       500:
 *         description: Server error
 */
router.post('/create', createIdea);

export default router;
