const cityRepository = require("../repositories/cityRepository");

// Add City
async function addCity(data) {
    return await cityRepository.createCity(data);
}

// Update City
async function updateCity(id, data) {
    return await cityRepository.updateCity(id, data);
}

// Get All Cities
async function getAllCities() {
    return await cityRepository.getAllCities();
}

// Get Cities by State
async function getCitiesByState(stateId) {
    return await cityRepository.getCitiesByState(stateId);
}

// Delete City
async function deleteCity(id) {
    return await cityRepository.deleteCity(id);
}

module.exports = {
    addCity,
    updateCity,
    getAllCities,
    getCitiesByState,
    deleteCity
};
