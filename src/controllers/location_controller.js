const locationService = require('../services/location_service');

class LocationController {
    // Countries
    addCountry = async (req, res) => {
        try {
            const country = await locationService.addCountry(req.body);
            res.status(201).json({ success: true, data: country });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    updateCountry = async (req, res) => {
        try {
            const country = await locationService.updateCountry(req.params.id, req.body);
            res.status(200).json({ success: true, data: country });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    getAllCountries = async (req, res) => {
        try {
            const countries = await locationService.getAllCountries();
            res.status(200).json({ success: true, data: countries });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    getCountryById = async (req, res) => {
        try {
            const country = await locationService.getCountryById(req.params.id);
            res.status(200).json({ success: true, data: country });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    // States
    addState = async (req, res) => {
        try {
            const state = await locationService.addState(req.body);
            res.status(201).json({ success: true, data: state });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    updateState = async (req, res) => {
        try {
            const state = await locationService.updateState(req.params.id, req.body);
            res.status(200).json({ success: true, data: state });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    getAllStates = async (req, res) => {
        try {
            const states = await locationService.getAllStates();
            res.status(200).json({ success: true, data: states });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    getStateById = async (req, res) => {
        try {
            const state = await locationService.getStateById(req.params.id);
            res.status(200).json({ success: true, data: state });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
    getStatesByCountryId = async (req, res) => {
        try {
            const states = await locationService.getStatesByCountryId(req.params.countryId);
            res.status(200).json({ success: true, data: states });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cities
    addCity = async (req, res) => {
        try {
            const city = await locationService.addCity(req.body);
            res.status(201).json({ success: true, data: city });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    updateCity = async (req, res) => {
        try {
            const city = await locationService.updateCity(req.params.id, req.body);
            res.status(200).json({ success: true, data: city });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    getAllCities = async (req, res) => {
        try {
            const cities = await locationService.getAllCities();
            res.status(200).json({ success: true, data: cities });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    getCityById = async (req, res) => {
        try {
            const city = await locationService.getCityById(req.params.id);
            res.status(200).json({ success: true, data: city });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
    getCitiesByStateId = async (req, res) => {
        try {
            const cities = await locationService.getCitiesByStateId(req.params.stateId);
            res.status(200).json({ success: true, data: cities });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Pincodes
    addPincode = async (req, res) => {
        try {
            const pincode = await locationService.addPincode(req.body);
            res.status(201).json({ success: true, data: pincode });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    updatePincode = async (req, res) => {
        try {
            const pincode = await locationService.updatePincode(req.params.id, req.body);
            res.status(200).json({ success: true, data: pincode });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    getAllPincodes = async (req, res) => {
        try {
            const pincodes = await locationService.getAllPincodes();
            res.status(200).json({ success: true, data: pincodes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    getPincodeById = async (req, res) => {
        try {
            const pincode = await locationService.getPincodeById(req.params.id);
            res.status(200).json({ success: true, data: pincode });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
    getPincodesByCityId = async (req, res) => {
        try {
            const pincodes = await locationService.getPincodesByCityId(req.params.cityId);
            res.status(200).json({ success: true, data: pincodes });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new LocationController();
