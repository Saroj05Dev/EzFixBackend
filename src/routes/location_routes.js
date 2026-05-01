const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location_controller');

// Countries
router.post('/countries', locationController.addCountry);
router.put('/countries/:id', locationController.updateCountry);
router.get('/countries', locationController.getAllCountries);
router.get('/countries/:id', locationController.getCountryById);

// States
router.post('/states', locationController.addState);
router.put('/states/:id', locationController.updateState);
router.get('/states', locationController.getAllStates);
router.get('/states/:id', locationController.getStateById);
router.get('/states/country/:countryId', locationController.getStatesByCountryId);

// Cities
router.post('/cities', locationController.addCity);
router.put('/cities/:id', locationController.updateCity);
router.get('/cities', locationController.getAllCities);
router.get('/cities/:id', locationController.getCityById);
router.get('/cities/state/:stateId', locationController.getCitiesByStateId);

// Pincodes
router.post('/pincodes', locationController.addPincode);
router.put('/pincodes/:id', locationController.updatePincode);
router.get('/pincodes', locationController.getAllPincodes);
router.get('/pincodes/:id', locationController.getPincodeById);
router.get('/pincodes/city/:cityId', locationController.getPincodesByCityId);

module.exports = router;
