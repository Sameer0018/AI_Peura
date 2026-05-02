const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function fixGaps() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Idea = mongoose.connection.db.collection('ideas');
        
        const targetDates = [new Date('2026-05-03T10:00:00Z'), new Date('2026-05-04T10:00:00Z')];
        const ideas = await Idea.find({ scheduledDate: { $in: targetDates } }).toArray();
        
        for (const idea of ideas) {
            if (!idea.script || !idea.script.hook) {
                console.log(`Setting fallback script for: ${idea.title}`);
                await Idea.updateOne(
                    { _id: idea._id },
                    { $set: { 
                        script: {
                            hook: "Wait... did you see what's trending in eyewear?",
                            storyline: "Scene 1: Close up of fabric texture. Scene 2: Model walking in street lighting.",
                            visualDirection: "Street style lighting, candid movement, model looking confident.",
                            productFraming: "Focus on fit and movement while walking.",
                            cta: "Shop the look. Link in bio.",
                            variations: [
                                { hook: "The eyewear trend you can't ignore.", angle: "FOMO driven" }
                            ],
                            caption: "The red carpet is calling, but your wallet doesn't have to scream. 🕶️",
                            hashtags: ["#PeuraStyle", "#EyewearTrends"]
                        }
                    } }
                );
            }
        }

        console.log('Done.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixGaps();
