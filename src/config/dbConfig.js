const mongoose = require('mongoose');
const serverConfig = require('./serverConfig');

async function connectDB() {
    try {
        await mongoose.connect(serverConfig.DB_URL);
        console.log("Successfully connected to the mongo db server .....");

        try {
            const User = require('../schema/userSchema');
            const indexes = await mongoose.connection.collection('users').indexes();
            const phoneIndex = indexes.find((index) => index.name === 'phone_1');

            if (phoneIndex && !phoneIndex.sparse) {
                await mongoose.connection.collection('users').dropIndex('phone_1');
                console.log("✅ Migrated old phone_1 index to sparse index.");
            }

            await User.syncIndexes();
        } catch (idxError) {
            if (idxError.codeName !== 'IndexNotFound') {
                console.log("Index setup msg:", idxError.message);
            }
        }
    } catch (error) {
        console.log("Not able to connect to the mongodb server");
        console.log(error);
    }
}

module.exports = connectDB;
