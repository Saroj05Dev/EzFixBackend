const { Server } = require("socket.io");
const ServerConfig = require("./serverConfig");

let io;
const userSockets = new Map();

// Debounce timers per bookingId to avoid hitting DB on every GPS tick
const dbWriteTimers = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow all vercel domains + configured origin
        if (
          !origin ||
          origin === ServerConfig.CORS_ORIGIN ||
          (origin && origin.endsWith(".vercel.app")) ||
          origin === "http://localhost:5173" ||
          origin === "http://localhost:5174"
        ) {
          callback(null, true);
        } else {
          callback(null, true); // permissive for WS – HTTP layer already guards
        }
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      userSockets.set(userId, socket.id);
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on("updateLocation", async (data) => {
      const { userId, role, lat, lng, bookingId, targetId } = data;

      // Validate payload
      if (
        typeof lat !== "number" ||
        typeof lng !== "number" ||
        isNaN(lat) ||
        isNaN(lng)
      ) {
        return;
      }

      // Broadcast to the other party immediately
      if (targetId) {
        io.to(`user_${targetId}`).emit("locationUpdated", {
          userId,
          role,
          lat,
          lng,
          bookingId,
        });
      }

      // Persist provider location to DB (debounced: 3 seconds)
      if (role === "provider" && bookingId) {
        if (dbWriteTimers.has(bookingId)) {
          clearTimeout(dbWriteTimers.get(bookingId));
        }
        dbWriteTimers.set(
          bookingId,
          setTimeout(async () => {
            try {
              const Booking = require("../schema/booking_schema");
              await Booking.findByIdAndUpdate(bookingId, {
                providerLat: lat,
                providerLng: lng,
                providerLastSeen: new Date(),
              });
            } catch (err) {
              console.error("[socket] Failed to persist provider location:", err.message);
            } finally {
              dbWriteTimers.delete(bookingId);
            }
          }, 3000)
        );
      }
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { initSocket, getIO };
