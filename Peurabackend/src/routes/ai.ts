import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Idea from '../models/Idea';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""); 

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, imageBase64, ideaId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    let formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
      formattedHistory.shift();
    }

    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: {
        parts: [{ text: "You are an expert Creative Director and AI Copywriter for Peura Opticals, a premium D2C eyewear brand. You write highly engaging, strategic scripts, captions, and concepts for Instagram Reels and posts. Maintain a sophisticated, fashion-forward, and persuasive tone. Output ONLY the rewritten text, without conversational filler unless the user asks a general question." }],
        role: "system"
      }
    });

    const currentMessage = messages[messages.length - 1];
    let parts: any[] = [{ text: currentMessage.content }];

    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1];
      const mimeType = imageBase64.split(';')[0].split(':')[1];
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || "image/jpeg"
        }
      });
    }

    const result = await chat.sendMessage(parts);
    const response = await result.response;
    const text = response.text();
    const usage = response.usageMetadata;
    const tokens = usage?.totalTokenCount || 0;

    if (ideaId) {
        await Idea.findByIdAndUpdate(ideaId, { $inc: { tokensUsed: tokens } });
    }

    res.json({ 
      response: text,
      totalTokens: tokens
    });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/ai/generate:
 *   post:
 *     summary: Generate campaign script
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idea:
 *                 type: object
 *     responses:
 *       200:
 *         description: Generated script
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      res.status(400).json({ error: "Idea is required" });
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are a senior D2C fashion brand strategist and creative director for "Peura Opticals".

      Context:
      - Brand Name: Peura Opticals
      - Category: Premium Eyewear / D2C Fashion
      - Target Audience: Gen Z and Millennials, fashion-forward, urban, value-conscious but style-driven.
      - Platform: ${idea.contentType === 'Video' ? 'Instagram Reels / TikTok' : 'Instagram Feed / Meta Ads'}
      - Campaign Idea: ${idea.title}
      - Content Format: ${idea.contentType}
      
      Task:
      Generate a high-converting campaign script and creative direction using a fashion-first lens.

      Output Requirements (JSON Format):
      1. hook: (0–3 sec) Scroll-stopping line.
      2. storyline: Scene-by-scene breakdown with camera angles. Highlight fabric/material, fit, lifestyle usage.
      3. visualDirection: Poses, expressions, lighting.
      4. productFraming: Focus on texture, fit, and movement.
      5. cta: Strong CTA with urgency or exclusivity.
      6. variations: 3 objects with { hook, angle }.
      7. caption: Engaging Instagram caption.
      8. hashtags: 5 relevant hashtags.

      Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const script = JSON.parse(cleanJson);

    res.json({ script });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
