const {
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
  findBookingById,
  createBooking,
  getAllBookings,
  deleteBookingRepo,
} = require("../repositories/booking_repositories");
const notificationService = require("./notification_service");
const { createRazorpayOrder } = require("./paymentService");

async function getCustomerBookingsService(id) {
  return await getCustomerBookings(id);
}
async function getProviderBookingsService(id) {
  return await getProviderBookings(id);
}

async function cancelBookingService(bookingId, userId) {
  const booking = await findBookingById(bookingId);
  if (!booking || booking.customer_id.toString() !== userId)
    throw { reason: "Unauthorized", statusCode: 403 };
  if (booking.status === "Cancelled")
    throw { reason: "Already cancelled", statusCode: 400 };
  const updatedBooking = await updateBookingStatus(bookingId, "Cancelled");
  await notificationService.notifyBookingStatusUpdate(
    booking,
    booking.provider_id,
    "Cancelled",
  );
  return updatedBooking;
}

async function updateBookingStatusService(bookingId, providerId, status) {
  const booking = await findBookingById(bookingId);
  if (!booking || booking.provider_id._id.toString() !== providerId) {
    // Check if it's an object or string
    const pId = booking.provider_id._id ? booking.provider_id._id.toString() : booking.provider_id.toString();
    if (pId !== providerId) throw { reason: "Unauthorized", statusCode: 403 };
  }

  const valid = {
    Pending: ["Confirmed"],
    Confirmed: ["In Progress", "Completed"],
    "In Progress": ["Completed"],
  };

  if (!valid[booking.status]?.includes(status))
    throw { reason: "Invalid status", statusCode: 400 };

  // Calculate commission if the status is changing to Completed
  if (status === "Completed") {
    const commissionPercent = 10; // 10% commission
    booking.commissionAmount = (booking.amount * commissionPercent) / 100;
  }

  const updatedBooking = await updateBookingStatus(bookingId, status);

  // If we just updated status to Completed, also save the commission amount calculated above
  if (status === "Completed") {
    updatedBooking.commissionAmount = booking.commissionAmount;
    await updatedBooking.save();
  }

  await notificationService.notifyBookingStatusUpdate(
    booking,
    booking.customer_id,
    status
  );
  return updatedBooking;
}

async function createBookingService(userId, payload) {
  // payload must contain: provider_id, service_id, address, lat, long, amount
  const { provider_id, service_id, address, lat, long, amount } = payload;

  if (!provider_id || !service_id || !address || amount == null) {
    throw { reason: "Missing required fields", statusCode: 400 };
  }

  const bookingData = {
    customer_id: userId,
    provider_id,
    service_id,
    address,
    lat: lat ?? null,
    long: long ?? null,
    amount,
    paymentStatus: "Pending",
  };

  const booking = await createBooking(bookingData);

  // Notify provider about the new booking
  await notificationService.notifyNewBooking(booking, provider_id);

  return { booking };
}

async function deleteBookingService(bookingId, userId) {
  const booking = await findBookingById(bookingId);
  if (!booking) throw { reason: "Booking not found", statusCode: 404 };

  // Allow either the customer or the professional to delete historical records if they wish, 
  // or restricted to just the customer for their own history. 
  // User usually means delete from THEIR view.
  // For simplicity, we hard delete if the requesting user is the customer.
  if (booking.customer_id.toString() !== userId) {
    throw { reason: "Unauthorized to delete this booking", statusCode: 403 };
  }

  // Optional: Only allow deleting Completed or Cancelled bookings
  if (!["Completed", "Cancelled"].includes(booking.status)) {
    throw { reason: "Cannot delete an active booking", statusCode: 400 };
  }

  return await deleteBookingRepo(bookingId);
}

async function getProviderLocationService(bookingId, requestingUserId) {
  const booking = await findBookingById(bookingId);
  if (!booking) throw { reason: "Booking not found", statusCode: 404 };

  // Only the customer of this booking or the provider can request location
  const customerId = booking.customer_id._id
    ? booking.customer_id._id.toString()
    : booking.customer_id.toString();
  const providerId = booking.provider_id._id
    ? booking.provider_id._id.toString()
    : booking.provider_id.toString();

  if (requestingUserId !== customerId && requestingUserId !== providerId) {
    throw { reason: "Unauthorized", statusCode: 403 };
  }

  return {
    // Provider last known live location
    providerLat: booking.providerLat ?? null,
    providerLng: booking.providerLng ?? null,
    providerLastSeen: booking.providerLastSeen ?? null,
    // Customer pinned booking destination
    destinationLat: booking.lat ?? null,
    destinationLng: booking.long ?? null,
    address: booking.address,
  };
}

async function getAllBookingsService() {
  return await getAllBookings();
}

module.exports = {
  getCustomerBookingsService,
  getProviderBookingsService,
  cancelBookingService,
  updateBookingStatusService,
  createBookingService,
  getAllBookingsService,
  deleteBookingService,
  getProviderLocationService,
};
