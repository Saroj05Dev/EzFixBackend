const Booking = require("../schema/booking_schema");
require("../schema/Service_schema");
require("../schema/Subservice_schema");
require("../schema/Sub_services1_schema");
require("../schema/Sub_service2_schema");
require("../schema/Sub_service3_schema");

async function findBookingById(id) {
  return await Booking.findById(id);
}
async function getCustomerBookings(id) {
  return await Booking.find({ customer_id: id })
    .populate({
      path: "provider_id",
      select: "name phone rates workArea providerServices",
      populate: [
        { path: "providerServices.serviceId", select: "name" },
        { path: "providerServices.subServiceId", select: "name" },
      ],
    })
    .populate({
      path: "service_id",
      populate: [
        { path: "serviceId", select: "name" },
        { path: "subServiceId", select: "name" },
        { path: "subService1Id", select: "name" },
        { path: "subService2Id", select: "name" },
      ]
    })
    .populate("customer_id", "name phone")
    .sort({ createdAt: -1 });
}
async function getProviderBookings(id) {
  return await Booking.find({ provider_id: id })
    .populate("customer_id", "name phone")
    .populate({
      path: "service_id",
      populate: [
        { path: "serviceId", select: "name" },
        { path: "subServiceId", select: "name" },
        { path: "subService1Id", select: "name" },
        { path: "subService2Id", select: "name" },
      ],
    })
    .populate("provider_id", "name phone rates workArea")
    .sort({ createdAt: -1 });
}
async function updateBookingStatus(id, status) {
  return await Booking.findByIdAndUpdate(id, { status }, { new: true })
    .populate("customer_id", "name phone")
    .populate({
      path: "service_id",
      populate: [
        { path: "serviceId", select: "name" },
        { path: "subServiceId", select: "name" },
        { path: "subService1Id", select: "name" },
        { path: "subService2Id", select: "name" },
      ],
    })
    .populate("provider_id", "name phone rates workArea");
}

async function countActiveAcceptedProviderBookings(providerId) {
  return await Booking.countDocuments({
    provider_id: providerId,
    status: { $in: ["Confirmed", "In Progress"] },
  });
}

async function createBooking(bookingData) {
  const booking = new Booking(bookingData);
  return await booking.save();
}

async function getAllBookings() {
  return await Booking.find({})
    .populate("customer_id", "name phone")
    .populate("provider_id", "name phone rates")
    .populate({
      path: "service_id",
      populate: [
        { path: "serviceId", select: "name" },
        { path: "subServiceId", select: "name" },
        { path: "subService1Id", select: "name" },
        { path: "subService2Id", select: "name" },
      ]
    })
    .sort({ date: -1 });
}

async function deleteBookingRepo(id) {
  return await Booking.findByIdAndDelete(id);
}

module.exports = {
  findBookingById,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
  countActiveAcceptedProviderBookings,
  createBooking,
  getAllBookings,
  deleteBookingRepo,
};
