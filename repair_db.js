const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
    console.error("DB_URL not found in .env file");
    process.exit(1);
}

async function repair() {
    console.log("Connecting to:", DB_URL);
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to MongoDB successfully!");

        const collection = mongoose.connection.collection('users');

        // 1. Drop the index
        console.log("Attempting to drop phone_1 index...");
        try {
            await collection.dropIndex("phone_1");
            console.log("SUCCESS: Dropped 'phone_1' index.");
        } catch (err) {
            console.log("NOTE: 'phone_1' index didn't exist or already dropped.");
        }

        // 2. Clear out any nulls
        console.log("Cleaning up users with phone: null...");
        const result = await collection.updateMany(
            { phone: null },
            { $unset: { phone: "" } }
        );
        console.log(`SUCCESS: Removed 'null' phone field from ${result.modifiedCount} users.`);

        console.log("\n--- REPAIR COMPLETE ---");
        console.log("Now restart your server. Mongoose will recreate the index with the 'sparse' setting correctly.");
        
    } catch (error) {
        console.error("Repair failed:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

repair();
