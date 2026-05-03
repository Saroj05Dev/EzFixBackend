// src/repositories/review_repository.js
const Review = require("../schema/review_schema");

async function createReview(data) {
    try {
        return await Review.create(data);
    } catch (error) {
        throw error;
    }
}

async function getAllReviews() {
    try {
        return await Review.find()
            .populate('customer_id', 'name')
            .populate('provider_id', 'name')
            .populate({
                path: 'booking_id',
                populate: {
                    path: 'service_id',
                    select: 'serviceId'
                }
            })
            .sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
}

async function getProviderReviews(providerId) {
    try {
        return await Review.find({ provider_id: providerId, isVisible: true })
            .populate('customer_id', 'name email')
            .populate({
                path: 'booking_id',
                populate: {
                    path: 'service_id',
                    populate: {
                        path: 'serviceId'
                    }
                }
            })
            .sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
}

async function hideReview(id) {
    try {
        const review = await Review.findByIdAndUpdate(id, { isVisible: false }, { new: true });
        if (!review) throw new Error("Review not found");
        return review;
    } catch (error) {
        throw error;
    }
}

async function findReviewById(id) {
    try {
        const review = await Review.findById(id);
        if (!review) throw new Error("Review not found");
        return review;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createReview,
    getAllReviews,
    getProviderReviews,
    hideReview,
    findReviewById
};
