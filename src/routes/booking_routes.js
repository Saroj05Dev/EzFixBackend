const express = require("express");
const {
  getCustomerBookings,
  cancelBooking,
  getProviderBookings,
  updateBookingStatus,
  createBooking,
  getAllBookings,
  deleteBooking,
  getProviderLocation,
} = require("../controllers/booking_controller");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/customer", isAuthenticated, getCustomerBookings); // removed :id as we get userid from user.id
router.put("/:id/cancel", isAuthenticated, cancelBooking);
router.get(
  "/provider",
  isAuthenticated,
  isAuthorized(["provider"]),
  getProviderBookings
);
router.put(
  "/:id/update",
  isAuthenticated,
  isAuthorized(["provider"]),
  updateBookingStatus
);
router.post("/", isAuthenticated, createBooking); // Add a booking (customer only)
router.delete("/:id", isAuthenticated, deleteBooking);
router.get("/:id/provider-location", isAuthenticated, getProviderLocation); // Last known provider GPS
router.get("/", isAuthenticated, isAuthorized(["admin"]), getAllBookings); // Admin-only list
module.exports = router;
