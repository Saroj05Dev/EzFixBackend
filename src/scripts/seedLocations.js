const mongoose = require('mongoose');
const { Country, State, City } = require('../schema/location_schema');
const ServerConfig = require('../config/serverConfig');

async function seedData() {
    try {
        await mongoose.connect(ServerConfig.DB_URL);
        console.log("Connected to DB for seeding...");

        // Clear existing data
        await Country.deleteMany({});
        await State.deleteMany({});
        await City.deleteMany({});

        // Add India
        const india = await Country.create({ name: 'India', code: 'IN' });
        console.log("Added Country: India");

        // Add States
        const states = [
            { name: 'Maharashtra', country: india._id },
            { name: 'Karnataka', country: india._id },
            { name: 'Delhi', country: india._id },
            { name: 'Tamil Nadu', country: india._id }
        ];
        const createdStates = await State.insertMany(states);
        console.log(`Added ${createdStates.length} states.`);

        // Add some cities for Maharashtra
        const mh = createdStates.find(s => s.name === 'Maharashtra');
        const mhCities = [
            { name: 'Mumbai', state: mh._id },
            { name: 'Pune', state: mh._id },
            { name: 'Nagpur', state: mh._id }
        ];
        await City.insertMany(mhCities);
        console.log("Added cities for Maharashtra.");

        // Add some cities for Karnataka
        const ka = createdStates.find(s => s.name === 'Karnataka');
        const kaCities = [
            { name: 'Bengaluru', state: ka._id },
            { name: 'Mysuru', state: ka._id }
        ];
        await City.insertMany(kaCities);
        console.log("Added cities for Karnataka.");

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seedData();
