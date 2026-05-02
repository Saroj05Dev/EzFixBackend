const stateRepository = require("../repositories/stateRepository");

// Add State
async function addState(data) {
    return await stateRepository.createState(data);
}

// Update State
async function updateState(id, data) {
    return await stateRepository.updateState(id, data);
}

// Get All States
async function getAllStates() {
    return await stateRepository.getAllStates();
}

// Get States by Country
async function getStatesByCountry(countryId) {
    return await stateRepository.getStatesByCountry(countryId);
}

// Delete State
async function deleteState(id) {
    return await stateRepository.deleteState(id);
}

module.exports = {
    addState,
    updateState,
    getAllStates,
    getStatesByCountry,
    deleteState
};
