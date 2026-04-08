const {
  getCustomerBookingsService,
  cancelBookingService,
  getProviderBookingsService,
  updateBookingStatusService,
  createBookingService,
  getAllBookingsService,
  deleteBookingService,
} = require("../services/booking_service");

async function getCustomerBookings(req, res) {
  try {
    return res
      .status(200)
      .json({
        success: true,
        data: await getCustomerBookingsService(req.user.id),
      });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}
async function createBooking(req, res) {
  try {
    const booking = await createBookingService(req.user.id, req.body);
    return res.status(201).json({ success: true, data: booking });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await getAllBookingsService();
    return res.status(200).json({ success: true, data: bookings });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}
async function cancelBooking(req, res) {
  try {
    return res
      .status(200)
      .json({
        success: true,
        data: await cancelBookingService(req.params.id, req.user.id),
      });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function getProviderBookings(req, res) {
  try {
    return res
      .status(200)
      .json({
        success: true,
        data: await getProviderBookingsService(req.user.id),
      });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function updateBookingStatus(req, res) {
  try {
    return res
      .status(200)
      .json({
        success: true,
        data: await updateBookingStatusService(
          req.params.id,
          req.user.id,
          req.body.status
        ),
      });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function deleteBooking(req, res) {
  try {
    await deleteBookingService(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ success: false, error: e.reason });
  }
}

module.exports = {
  getCustomerBookings,
  cancelBooking,
  getProviderBookings,
  updateBookingStatus,
  createBooking,
  getAllBookings,
  deleteBooking,
};
