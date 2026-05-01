const locationService = require("../services/countryService");

// Add Country
const addCountry = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Country name is required"
            });
        }

        if (!code || code.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Country code is required"
            });
        }

        const country = await locationService.addCountry({
            name: name.trim(),
            code: code.trim().toUpperCase()
        });

        return res.status(201).json({
            success: true,
            data: country
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Country
const updateCountry = async (req, res) => {
    try {
        const country = await locationService.updateCountry(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: country
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Countries
const getAllCountries = async (req, res) => {
    try {
        const countries = await locationService.getAllCountries();

        return res.status(200).json({
            success: true,
            data: countries
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addCountry,
    updateCountry,
    getAllCountries
};