import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, imageBase64 } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format history for Gemini SDK
    // Gemini expects history in format: { role: "user" | "model", parts: [{ text: "..." }] }
    // The history MUST start with a 'user' message.
    
    let formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Ensure history starts with 'user'
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

    // Handle optional image attachment
    if (imageBase64) {
      // The imageBase64 typically comes with a prefix like "data:image/jpeg;base64,..."
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

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
