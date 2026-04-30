const express = require("express");
const { getMessagesByBookingId } = require("../controllers/chat_controller");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:bookingId/messages", isAuthenticated, getMessagesByBookingId);

module.exports = router;
