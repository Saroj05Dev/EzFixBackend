const { Country, State, City, Pincode } = require('../schema/location_schema');

class LocationRepository {
    // Countries
    async createCountry(data) {
        return await Country.create(data);
    }
    async updateCountry(id, data) {
        return await Country.findByIdAndUpdate(id, data, { new: true });
    }
    async getAllCountries() {
        return await Country.find().sort({ name: 1 });
    }
    async getCountryById(id) {
        return await Country.findById(id);
    }

    // States
    async createState(data) {
        return await State.create(data);
    }
    async updateState(id, data) {
        return await State.findByIdAndUpdate(id, data, { new: true });
    }
    async getAllStates() {
        return await State.find().populate('country').sort({ name: 1 });
    }
    async getStateById(id) {
        return await State.findById(id).populate('country');
    }
    async getStatesByCountryId(countryId) {
        return await State.find({ country: countryId }).sort({ name: 1 });
    }

    // Cities
    async createCity(data) {
        return await City.create(data);
    }
    async updateCity(id, data) {
        return await City.findByIdAndUpdate(id, data, { new: true });
    }
    async getAllCities() {
        return await City.find().populate({
            path: 'state',
            populate: { path: 'country' }
        }).sort({ name: 1 });
    }
    async getCityById(id) {
        return await City.findById(id).populate({
            path: 'state',
            populate: { path: 'country' }
        });
    }
    async getCitiesByStateId(stateId) {
        return await City.find({ state: stateId }).sort({ name: 1 });
    }

    // Pincodes
    async createPincode(data) {
        return await Pincode.create(data);
    }
    async updatePincode(id, data) {
        return await Pincode.findByIdAndUpdate(id, data, { new: true });
    }
    async getAllPincodes() {
        return await Pincode.find().populate({
            path: 'city',
            populate: {
                path: 'state',
                populate: { path: 'country' }
            }
        });
    }
    async getPincodeById(id) {
        return await Pincode.findById(id).populate({
            path: 'city',
            populate: {
                path: 'state',
                populate: { path: 'country' }
            }
        });
    }
    async getPincodesByCityId(cityId) {
        return await Pincode.find({ city: cityId });
    }
}

module.exports = new LocationRepository();
