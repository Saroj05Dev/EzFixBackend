const { Server } = require("socket.io");
const ServerConfig = require("./serverConfig");
const Message = require("../schema/message_schema");
const Booking = require("../schema/booking_schema");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        ServerConfig.CORS_ORIGIN,
        "http://localhost:5173",
        "http://localhost:5174",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // ===============================
    // USER PERSONAL ROOM JOIN
    // ===============================
    socket.on("join", (userId) => {
      if (!userId) return;

      socket.userId = userId.toString();
      socket.join(`user_${userId}`);
    });

    // ===============================
    // BOOKING ROOM JOIN
    // ===============================
    socket.on("joinBooking", async (bookingId) => {
      if (!bookingId) return;

      socket.join(`booking_${bookingId}`);
    });

    // ===============================
    // LEAVE BOOKING ROOM
    // ===============================
    socket.on("leaveBooking", (bookingId) => {
      if (!bookingId) return;

      socket.leave(`booking_${bookingId}`);
    });

    // ===============================
    // PROVIDER LIVE LOCATION
    // ===============================
    socket.on("updateLocation", async (data) => {
      try {
        const { bookingId, userId, role, lat, lng, targetId } = data || {};
        const providerUserId = (userId || socket.userId)?.toString();
        const parsedLat = Number(lat);
        const parsedLng = Number(lng);

        if (
          !bookingId ||
          !providerUserId ||
          role !== "provider" ||
          !Number.isFinite(parsedLat) ||
          !Number.isFinite(parsedLng)
        ) {
          return;
        }

        const booking = await Booking.findOneAndUpdate(
          { _id: bookingId, provider_id: providerUserId },
          {
            $set: {
              providerLat: parsedLat,
              providerLng: parsedLng,
              providerLastSeen: new Date(),
            },
          },
          { new: true },
        ).select("customer_id providerLastSeen");

        if (!booking) return;

        const payload = {
          bookingId: bookingId.toString(),
          userId: providerUserId,
          role: "provider",
          lat: parsedLat,
          lng: parsedLng,
          lastSeen: booking.providerLastSeen,
        };

        io.to(`booking_${bookingId}`).emit("locationUpdated", payload);
        io.to(`user_${booking.customer_id}`).emit("locationUpdated", payload);
        if (targetId) io.to(`user_${targetId}`).emit("locationUpdated", payload);
      } catch (err) {
        console.error("Socket updateLocation error:", err.message);
      }
    });

    // ===============================
    // REALTIME CHAT SYSTEM FIXED
    // ===============================
    socket.on("sendMessage", async (data) => {
      try {
        const { bookingId, senderId, senderModel, message } = data;

        if (
          !bookingId ||
          !senderId ||
          !senderModel ||
          !message ||
          !message.trim()
        ) {
          return;
        }

        // Fetch booking details
        const booking = await Booking.findById(bookingId)
          .select("customer_id provider_id status")
          .lean();

        if (!booking) {
          console.log("Booking not found");
          return;
        }

        if (!["Confirmed", "In Progress", "Completed"].includes(booking.status)) {
          return;
        }

        let receiverId;
        let receiverModel;

        // Auto detect receiver
        if (senderModel === "Customer") {
          receiverId = booking.provider_id;
          receiverModel = "Provider";
        } else if (senderModel === "Provider") {
          receiverId = booking.customer_id;
          receiverModel = "Customer";
        } else {
          return;
        }

        // Save message in DB
        const newMessage = await Message.create({
          bookingId,
          senderId,
          senderModel,
          receiverId,
          receiverModel,
          message: message.trim(),
          isRead: false,
        });

        // Populate sender and receiver info
        const populatedMessage = await Message.findById(newMessage._id)
          .populate("senderId", "name avatar")
          .populate("receiverId", "name avatar");

        // ===============================
        // SEND TO BOOKING ROOM
        // ===============================
        io.to(`booking_${bookingId}`).emit(
          "receiveMessage",
          populatedMessage
        );

        // ===============================
        // SEND TO RECEIVER PERSONAL ROOM
        // ===============================
        io.to(`user_${receiverId}`).emit(
          "receiveMessage",
          populatedMessage
        );
      } catch (err) {
        console.error("Socket sendMessage error:", err.message);
      }
    });

    // ===============================
    // DISCONNECT
    // ===============================
    socket.on("disconnect", () => {});
  });

  return io;
}

module.exports = { initSocket };
