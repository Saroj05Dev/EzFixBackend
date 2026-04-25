const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubService3",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Cancelled", "Completed"],
      default: "Pending",
    },
    address: { type: String, required: true },
    lat: Number,
    long: Number,
    amount: { type: Number, required: true, min: 0 },
    commissionAmount: { type: Number, default: 0 },
    commissionStatus: {
      type: String,
      enum: ["Pending", "Paid", "Waived"],
      default: "Pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    // Provider live-location persistence (updated in real-time via socket)
    providerLat: { type: Number, default: null },
    providerLng: { type: Number, default: null },
    providerLastSeen: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
