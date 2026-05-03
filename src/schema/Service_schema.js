const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be less than 0'],
        max: [100, 'Discount cannot exceed 100'],
        default: null,
    },
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;