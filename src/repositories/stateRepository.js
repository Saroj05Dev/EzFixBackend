const { State } = require("../schema/stateSchema");

// Create State
async function createState(data) {
    return await State.create(data);
}

// Update State
async function updateState(id, data) {
    return await State.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
}

// Get All States
async function getAllStates() {
    return await State.find().populate("country").sort({ name: 1 });
}

// Get States by Country
async function getStatesByCountry(countryId) {
    return await State.find({ country: countryId }).sort({ name: 1 });
}

module.exports = {
    createState,
    updateState,
    getAllStates,
    getStatesByCountry
};
