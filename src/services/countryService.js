const countryRepository = require("../repositories/countryRepository");

async function addCountry(data) {
    return await countryRepository.createCountry(data);
}

async function updateCountry(id, data) {
    return await countryRepository.updateCountry(id, data);
}

async function getAllCountries() {
    return await countryRepository.getAllCountries();
}

module.exports = {
    addCountry,
    updateCountry,
    getAllCountries
};