const locationRepository = require('../repositories/location_repository');

class LocationService {
    // Countries
    async addCountry(data) {
        return await locationRepository.createCountry(data);
    }
    async updateCountry(id, data) {
        return await locationRepository.updateCountry(id, data);
    }
    async getAllCountries() {
        return await locationRepository.getAllCountries();
    }
    async getCountryById(id) {
        return await locationRepository.getCountryById(id);
    }

    // States
    async addState(data) {
        return await locationRepository.createState(data);
    }
    async updateState(id, data) {
        return await locationRepository.updateState(id, data);
    }
    async getAllStates() {
        return await locationRepository.getAllStates();
    }
    async getStateById(id) {
        return await locationRepository.getStateById(id);
    }
    async getStatesByCountryId(countryId) {
        return await locationRepository.getStatesByCountryId(countryId);
    }

    // Cities
    async addCity(data) {
        return await locationRepository.createCity(data);
    }
    async updateCity(id, data) {
        return await locationRepository.updateCity(id, data);
    }
    async getAllCities() {
        return await locationRepository.getAllCities();
    }
    async getCityById(id) {
        return await locationRepository.getCityById(id);
    }
    async getCitiesByStateId(stateId) {
        return await locationRepository.getCitiesByStateId(stateId);
    }

    // Pincodes
    async addPincode(data) {
        return await locationRepository.createPincode(data);
    }
    async updatePincode(id, data) {
        return await locationRepository.updatePincode(id, data);
    }
    async getAllPincodes() {
        return await locationRepository.getAllPincodes();
    }
    async getPincodeById(id) {
        return await locationRepository.getPincodeById(id);
    }
    async getPincodesByCityId(cityId) {
        return await locationRepository.getPincodesByCityId(cityId);
    }
}

module.exports = new LocationService();
