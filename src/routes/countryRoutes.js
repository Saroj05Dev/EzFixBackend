const express = require("express");
const router = express.Router();
const locationController = require("../controllers/countryController");

// Add Country
router.post("/countries", locationController.addCountry);

// Update Country
router.put("/countries/:id", locationController.updateCountry);

// Get All Countries
router.get("/countries", locationController.getAllCountries);

module.exports = router;