const { Country } = require("../schema/countrySchema");

// Create Country
async function createCountry(data) {
    return await Country.create(data);
}

// Update Country
async function updateCountry(id, data) {
    return await Country.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
}

// Get All Countries
async function getAllCountries() {
    return await Country.find().sort({ name: 1 });
}

module.exports = {
    createCountry,
    updateCountry,
    getAllCountries
};