import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const TEMPLATES = [
// ... (keep templates for fallback)
    {
        name: "The Trend Hijack",
        script: (theme: string) => ({
            hook: "Wait... did you see what's trending in eyewear?",
            mid: `Competitors are talking about ${theme.substring(0, 50)}... but Peura Opticals just took it to the next level. Same premium vibe, way better price.`,
            cta: "Shop the look. Link in bio.",
            caption: `The red carpet is calling, but your wallet doesn't have to scream. 🕶️ Inspired by the latest in ${theme.substring(0, 30)}.`,
            hashtags: "#PeuraStyle #EyewearTrends #LuxuryLook #BudgetFriendly #StyleInspo"
        })
    }
];

export async function generateFinalizedScript(theme: string, type: 'Video' | 'Carousel' | 'Post' | 'Story' = 'Video') {
    try {
        if (!process.env.GEMINI_API_KEY) throw new Error("No API Key");

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `
            You are an expert D2C marketing content creator for Peura Opticals. 
            Generate a high-converting marketing script for the following theme:
            Theme: ${theme}
            Content Format: ${type}
            
            The script must have these parts in JSON format:
            - hook: A powerful opening line.
            - mid: Compelling story/value prop.
            - cta: Clear call to action.
            - caption: Instagram caption.
            - hashtags: 5 relevant hashtags.

            Return ONLY the JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const script = JSON.parse(cleanJson);

        return {
            templateName: "Gemini AI",
            ...script
        };
    } catch (error) {
        console.error("AI Script Generation Failed, using fallback:", error);
        const template = TEMPLATES[0];
        const baseScript = template.script(theme);
        return {
            templateName: "Fallback: " + template.name,
            ...baseScript
        };
    }
}

