const cityService = require("../services/cityService");

// Add City
const addCity = async (req, res) => {
    try {
        const { name, state } = req.body; // Changed from stateId to state

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "City name is required"
            });
        }

        if (!state) {
            return res.status(400).json({
                success: false,
                message: "State ID is required"
            });
        }

        const city = await cityService.addCity({
            name: name.trim(),
            state // Changed from stateId to state
        });

        return res.status(201).json({
            success: true,
            data: city
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update City
const updateCity = async (req, res) => {
    try {
        const city = await cityService.updateCity(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: city
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Cities
const getAllCities = async (req, res) => {
    try {
        const cities = await cityService.getAllCities();

        return res.status(200).json({
            success: true,
            data: cities
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Cities by State
const getCitiesByState = async (req, res) => {
    try {
        const cities = await cityService.getCitiesByState(req.params.stateId);

        return res.status(200).json({
            success: true,
            data: cities
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addCity,
    updateCity,
    getAllCities,
    getCitiesByState
};
