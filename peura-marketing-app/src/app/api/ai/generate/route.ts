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
      You are an expert D2C marketing content creator for Peura Opticals. 
      Generate a high-converting marketing script for the following idea:
      Title: ${idea.title}
      Context: ${idea.context || "Peura Opticals brand marketing"}
      Content Format: ${idea.contentType}
      
      The script must have three parts in JSON format:
      - hook: A powerful opening line to grab attention in the first 3 seconds.
      - mid: A compelling story or value proposition that keeps them engaged.
      - cta: A clear call to action to drive sales or engagement.

      Return ONLY the JSON.
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
