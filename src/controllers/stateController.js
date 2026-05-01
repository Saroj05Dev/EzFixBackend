const stateService = require("../services/stateService");

// Add State
const addState = async (req, res) => {
    try {
        const { name, country } = req.body; // Changed from countryId to country

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "State name is required"
            });
        }

        if (!country) {
            return res.status(400).json({
                success: false,
                message: "Country ID is required"
            });
        }

        const state = await stateService.addState({
            name: name.trim(),
            country // Changed from countryId to country
        });

        return res.status(201).json({
            success: true,
            data: state
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update State
const updateState = async (req, res) => {
    try {
        const state = await stateService.updateState(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: state
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All States
const getAllStates = async (req, res) => {
    try {
        const states = await stateService.getAllStates();

        return res.status(200).json({
            success: true,
            data: states
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get States by Country
const getStatesByCountry = async (req, res) => {
    try {
        const states = await stateService.getStatesByCountry(req.params.countryId);

        return res.status(200).json({
            success: true,
            data: states
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addState,
    updateState,
    getAllStates,
    getStatesByCountry
};
