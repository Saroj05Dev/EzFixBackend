const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        }
    },
    { timestamps: true }
);

const Country = mongoose.model("Country", countrySchema);

module.exports = {
    Country
};