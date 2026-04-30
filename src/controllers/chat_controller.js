const Message = require("../schema/message_schema");
const Booking = require("../schema/booking_schema");

async function getMessagesByBookingId(req, res) {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id || req.user._id?.toString();

    const booking = await Booking.findById(bookingId).select("customer_id provider_id status").lean();
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (!["Confirmed", "In Progress", "Completed"].includes(booking.status)) {
      return res.status(403).json({ success: false, message: "Chat is available after the booking is accepted" });
    }

    const isParticipant =
      booking.customer_id?.toString() === userId ||
      booking.provider_id?.toString() === userId ||
      req.user.role === "admin";

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await Message.find({ bookingId })
      .populate("senderId", "name avatar")
      .populate("receiverId", "name avatar")
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getMessagesByBookingId,
};
