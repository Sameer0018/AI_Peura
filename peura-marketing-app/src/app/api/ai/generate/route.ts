import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
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
    
    // Clean up potential markdown formatting from AI
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const script = JSON.parse(cleanJson);

    return NextResponse.json({ script });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
