// src/services/reviewService.js
const { createReview, getProviderReviews, findReviewById, getAllReviewsWithService } = require("../repositories/review_repositories");
const Booking = require("../schema/booking_schema");

async function submitReview(customerId, { bookingId, rating, comment }) {
    const booking = await Booking.findById(bookingId).populate('customer_id provider_id');
    if (!booking || booking.customer_id._id.toString() !== customerId)
        throw { reason: "Invalid booking", statusCode: 400 };
    if (booking.status !== 'Completed')
        throw { reason: "Service not completed", statusCode: 400 };

    return await createReview({
        booking_id: bookingId,
        provider_id: booking.provider_id._id,
        customer_id: customerId,
        rating,
        comment
    });
}

async function getProviderReviewsService(providerId) {
    const reviews = await getProviderReviews(providerId);
    const avg = reviews.length ? Number((reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(2)) : 0;
    return { reviews, averageRating: avg };
}

async function getAllReviewsService() {
    return await require("../repositories/review_repositories").getAllReviews();
}

// Returns { [serviceId]: { avg: '4.5', count: 12 } } — used on the public Home page
async function getServiceRatingsService() {
    const reviews = await getAllReviewsWithService();
    const map = {};

    reviews.forEach((review) => {
        if (!review.rating) return;
        const svcId = review.booking_id?.service_id?.serviceId?._id?.toString();
        if (!svcId) return;

        if (!map[svcId]) map[svcId] = { sum: 0, count: 0 };
        map[svcId].sum += Number(review.rating);
        map[svcId].count += 1;
    });

    const result = {};
    Object.entries(map).forEach(([id, { sum, count }]) => {
        result[id] = { avg: (sum / count).toFixed(1), count };
    });
    return result;
}

module.exports = { submitReview, getProviderReviewsService, getAllReviewsService, getServiceRatingsService };