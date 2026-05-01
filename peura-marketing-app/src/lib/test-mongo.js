const mongoose = require('mongoose');

const uri = "mongodb+srv://sameeradarsh:xrKdZxrUiMx6TVRd@cluster0.sionlif.mongodb.net/peura?retryWrites=true&w=majority";

async function testConnection() {
    console.log("Attempting to connect to MongoDB...");
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
        });
        console.log("✅ Success! Successfully connected to MongoDB.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Connection failed!");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        process.exit(1);
    }
}

testConnection();
