const mongoose = require('mongoose');
const serverConfig = require('./serverConfig');

async function connectDB() {
    try {
        await mongoose.connect(serverConfig.DB_URL);
        console.log("Successfully connected to the mongo db server .....");

        try {
            await mongoose.connection.collection('users').dropIndex('phone_1');
            console.log("✅ Successfully dropped the old phone_1 index.");

            const User = require('../schema/userSchema');
            await User.syncIndexes();
            console.log("✅ Successfully re-synced new sparse indexes!");
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