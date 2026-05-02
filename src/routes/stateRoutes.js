const express = require("express");
const router = express.Router();
const stateController = require("../controllers/stateController");

// Add State
router.post("/states", stateController.addState);

// Update State
router.put("/states/:id", stateController.updateState);

// Get All States
router.get("/states", stateController.getAllStates);

// Get States by Country
router.get("/states/country/:countryId", stateController.getStatesByCountry);

// Delete State
router.delete("/states/:id", stateController.deleteState);

module.exports = router;
