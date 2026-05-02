const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { generateFinalizedScript } = require('../src/lib/scriptWriter');

async function fixGaps() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Idea = mongoose.connection.db.collection('ideas');
        
        const nullIdeas = await Idea.find({ scheduledDate: { $in: [new Date('2026-05-03T10:00:00Z'), new Date('2026-05-04T10:00:00Z')] } }).toArray();
        console.log(`Found ${nullIdeas.length} ideas to check scripts for.`);

        for (const idea of nullIdeas) {
            if (!idea.script || !idea.script.hook) {
                console.log(`Generating script for: ${idea.title}`);
                const script = await generateFinalizedScript(idea.title, idea.contentType || 'Video');
                await Idea.updateOne(
                    { _id: idea._id },
                    { $set: { 
                        script: {
                            hook: script.hook,
                            storyline: script.storyline,
                            visualDirection: script.visualDirection,
                            productFraming: script.productFraming,
                            cta: script.cta,
                            variations: script.variations,
                            caption: script.caption,
                            hashtags: script.hashtags,
                        },
                        tokensUsed: script.tokensUsed || 0
                    } }
                );
                console.log(`Script generated for: ${idea.title}`);
            }
        }

        console.log('Script check complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixGaps();
