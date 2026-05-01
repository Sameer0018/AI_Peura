const mongoose = require('mongoose');

const uri = "mongodb://sameeradarsh:xrKdZxrUiMx6TVRd@ac-dyapluq-shard-00-00.sionlif.mongodb.net:27017,ac-dyapluq-shard-00-01.sionlif.mongodb.net:27017,ac-dyapluq-shard-00-02.sionlif.mongodb.net:27017/Quesscorp_Lite?ssl=true&authSource=admin&retryWrites=true&w=majority";

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  link: { type: String, required: true, unique: true },
  competitor: { type: String, required: true },
  contentType: { type: String, enum: ['Video', 'Carousel', 'Post', 'Story'], default: 'Video' },
  scheduledDate: { type: Date },
  isDraft: { type: Boolean, default: true },
  scrapedAt: { type: Date, default: Date.now },
});

const Idea = mongoose.model('IdeaTest', IdeaSchema);

async function test() {
    await mongoose.connect(uri);
    console.log("Connected");
    
    await Idea.deleteMany({});
    
    await Idea.create({
        title: "Test Title",
        description: "Test Desc",
        link: "test-link-" + Date.now(),
        competitor: "Test Comp",
        contentType: "Carousel",
        scheduledDate: new Date(),
        isDraft: false
    });
    
    const saved = await Idea.findOne();
    console.log("Saved Document:", saved);
    process.exit(0);
}

test();
