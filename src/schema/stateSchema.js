const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Country",
            required: true
        }
    },
    { timestamps: true }
);

// Ensure unique state name per country
stateSchema.index({ name: 1, country: 1 }, { unique: true });

const State = mongoose.model("State", stateSchema);

module.exports = {
    State
};
