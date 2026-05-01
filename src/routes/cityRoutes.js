const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

// Add City
router.post("/cities", cityController.addCity);

// Update City
router.put("/cities/:id", cityController.updateCity);

// Get All Cities
router.get("/cities", cityController.getAllCities);

// Get Cities by State
router.get("/cities/state/:stateId", cityController.getCitiesByState);

module.exports = router;
