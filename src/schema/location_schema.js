const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
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
}, { timestamps: true });

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    }
}, { timestamps: true });

// Ensure unique state name per country
stateSchema.index({ name: 1, country: 1 }, { unique: true });

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
        required: true
    }
}, { timestamps: true });

// Ensure unique city name per state
citySchema.index({ name: 1, state: 1 }, { unique: true });

const pincodeSchema = new mongoose.Schema({
    pincode: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    }
}, { timestamps: true });

// Ensure unique pincode per city
pincodeSchema.index({ pincode: 1, city: 1 }, { unique: true });

const Country = mongoose.model('Country', countrySchema);
const State = mongoose.model('State', stateSchema);
const City = mongoose.model('City', citySchema);
const Pincode = mongoose.model('Pincode', pincodeSchema);

module.exports = { Country, State, City, Pincode };
