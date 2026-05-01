const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "State",
            required: true
        }
    },
    { timestamps: true }
);

// Ensure unique city name per state
citySchema.index({ name: 1, state: 1 }, { unique: true });

const City = mongoose.model("City", citySchema);

module.exports = {
    City
};
