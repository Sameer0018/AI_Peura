export const TEMPLATES = [
    {
        name: "The Trend Hijack",
        script: (theme: string) => ({
            hook: "Wait... did you see what's trending in eyewear?",
            mid: `Competitors are talking about ${theme.substring(0, 50)}... but Peura Opticals just took it to the next level. Same premium vibe, way better price.`,
            cta: "Shop the look. Link in bio.",
            caption: `The red carpet is calling, but your wallet doesn't have to scream. 🕶️ Inspired by the latest in ${theme.substring(0, 30)}.`,
            hashtags: "#PeuraStyle #EyewearTrends #LuxuryLook #BudgetFriendly #StyleInspo"
        })
    },
    {
        name: "Problem / Solution",
        script: (theme: string) => ({
            hook: "Stop scrolling if your eyes feel like this... 😵‍💫",
            mid: `We saw the latest buzz about ${theme.substring(0, 40)}. While others talk, Peura Opticals delivers. Our lenses are designed for your digital life.`,
            cta: "Protect your eyes. Link in bio.",
            caption: "Your eyes deserve a break. 💻 Blue light protection that actually looks good. #PeuraCare",
            hashtags: "#EyeHealth #BlueLightGlasses #PeuraOpticals #DigitalNomad #WorkFromHome"
        })
    },
    {
        name: "The Luxury Vibe",
        script: (theme: string) => ({
            hook: "Pov: You found the eyewear cheat code. ✨",
            mid: `Forget the thousands. We took the inspiration from ${theme.substring(0, 30)} and made it accessible. Real titanium, premium finish, Peura prices.`,
            cta: "Upgrade your gaze. Link in bio.",
            caption: "Luxury isn't a price tag, it's a feeling. 🏛️ Get the premium look today. #PeuraLuxe",
            hashtags: "#PremiumEyewear #QuietLuxury #PeuraOpticals #FashionDaily #OOTD"
        })
    }
];

export function generateFinalizedScript(theme: string, type: 'Video' | 'Carousel' | 'Post' | 'Story' = 'Video') {
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const baseScript = template.script(theme);
    
    // Tailor for content type
    let finalScript = { ...baseScript };
    
    if (type === 'Carousel') {
        finalScript.hook = `Slide 1: ${baseScript.hook}`;
        finalScript.mid = `Slide 2-4: ${baseScript.mid}`;
        finalScript.cta = `Slide 5: ${baseScript.cta}`;
    } else if (type === 'Story') {
        finalScript.hook = `Quick Tip: ${baseScript.hook}`;
        finalScript.mid = `Details: ${baseScript.mid.substring(0, 100)}...`;
        finalScript.cta = `Tap link!`;
    }
    
    return {
        templateName: template.name,
        ...finalScript
    };
}
