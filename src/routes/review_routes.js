// src/routes/review_routes.js
const express = require('express');
const { submit, getProviderReviews, getAllReviews, getServiceRatings } = require('../controllers/review_controller');
const { isAuthenticated, isAuthorized } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', isAuthenticated, submit);
router.get('/provider/:id', getProviderReviews);
router.get('/all', getAllReviews);
router.get('/ratings', getServiceRatings);

module.exports = router;