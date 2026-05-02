import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const TEMPLATES = [
    {
        name: "The Strategic Fashion Hijack",
        script: (theme: string) => ({
            hook: "Wait... did you see what's trending in eyewear?",
            storyline: `Scene 1: Close up of fabric texture. Scene 2: Model walking in street lighting. Script: Competitors are talking about ${theme.substring(0, 50)}... but Peura Opticals just took it to the next level. Same premium vibe, way better price.`,
            visualDirection: "Street style lighting, candid movement, model looking confident.",
            productFraming: "Focus on fit and movement while walking.",
            cta: "Shop the look. Link in bio.",
            variations: [
                { hook: "The eyewear trend you can't ignore.", angle: "FOMO driven" },
                { hook: "Luxury vibes, D2C prices.", angle: "Value driven" },
                { hook: "Your new daily essential.", angle: "Lifestyle driven" }
            ],
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
            You are a senior D2C fashion brand strategist and creative director for "Peura Opticals".

            Context:
            - Brand Name: Peura Opticals
            - Category: Premium Eyewear / D2C Fashion
            - Target Audience: Gen Z and Millennials, fashion-forward, urban, value-conscious but style-driven.
            - Platform: ${type === 'Video' ? 'Instagram Reels / TikTok' : 'Instagram Feed / Meta Ads'}
            - Campaign Theme: ${theme}
            - Content Format: ${type}

            Task:
            Generate a high-converting campaign script and creative direction using a fashion-first lens.

            Output Requirements (JSON Format):
            1. hook: (0–3 sec) Scroll-stopping line. Emotion-driven (aspiration, FOMO, confidence).
            2. storyline: Scene-by-scene breakdown with camera angles (close-up, mid-shot, transitions). Highlight fabric/material, fit, lifestyle usage.
            3. visualDirection: Poses, expressions, lighting (studio / outdoor / street).
            4. productFraming: Focus on texture, fit (oversized, tailored), and movement.
            5. cta: Strong CTA with urgency or exclusivity.
            6. variations: An array of 3 objects with { hook, angle } based on different emotional triggers.
            7. caption: Engaging Instagram caption.
            8. hashtags: 5 relevant hashtags.

            Return ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const usage = response.usageMetadata;
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const script = JSON.parse(cleanJson);

        if (typeof script.storyline !== 'string') {
            script.storyline = JSON.stringify(script.storyline, null, 2);
        }
        if (typeof script.visualDirection !== 'string') {
            script.visualDirection = JSON.stringify(script.visualDirection, null, 2);
        }

        return {
            templateName: "Strategic AI",
            tokensUsed: usage?.totalTokenCount || 0,
            ...script
        };
    } catch (error) {
        console.error("Strategic AI Generation Failed, using fallback:", error);
        const template = TEMPLATES[0];
        const baseScript = template.script(theme);
        return {
            templateName: "Fallback: " + template.name,
            ...baseScript
        };
    }
}

