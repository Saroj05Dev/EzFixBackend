const { City } = require("../schema/citySchema");

// Create City
async function createCity(data) {
    return await City.create(data);
}

// Update City
async function updateCity(id, data) {
    return await City.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
}

// Get All Cities
async function getAllCities() {
    return await City.find().populate("state").sort({ name: 1 });
}

// Get Cities by State
async function getCitiesByState(stateId) {
    return await City.find({ state: stateId }).sort({ name: 1 });
}

// Delete City
async function deleteCity(id) {
    return await City.findByIdAndDelete(id);
}

module.exports = {
    createCity,
    updateCity,
    getAllCities,
    getCitiesByState,
    deleteCity
};
