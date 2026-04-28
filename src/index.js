const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");

const ServerConfig = require("./config/serverConfig");
const connectDB = require("./config/dbConfig");
const { initSocket } = require("./config/socket");

const serviceRoutes = require("./routes/Service_routes");
const subServiceRoutes = require("./routes/Sub_services_routes");
const subServices1Routes = require("./routes/Sub_services1_routes");
const subService2Routes = require("./routes/Sub_service2_routes");
const subService3Routes = require("./routes/Sub_service3_routes");
const bookingRoutes = require("./routes/booking_routes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/admin_routes");
const authRouter = require("./routes/authRoutes");
const provideroutes = require("./routes/Provider_routes");
const reviewroutes = require("./routes/review_routes");
const notificationRoutes = require("./routes/notification_routes");
const paymentRoutes = require("./routes/paymentRoutes");
const settingsRoutes = require("./routes/settings_routes");
const chatRoutes = require("./routes/chat_routes");
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

app.set("trust proxy", 1); // Trust proxy required for secure cookies over HTTPS (e.g. Render/Heroku)

const allowedOrigins = [
  ServerConfig.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://do-ez-ui.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow if origin is in the allowed list, or if it's a vercel domain
      if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith(".vercel.app"))) {
        callback(null, true);
      } else {
        // Strip trailing slash if present on CORS_ORIGIN
        const cleanCorsOrigin = ServerConfig.CORS_ORIGIN ? ServerConfig.CORS_ORIGIN.replace(/\/$/, '') : '';
        if (origin === cleanCorsOrigin) {
          callback(null, true);
        } else {
          console.warn("[CORS] Blocked origin:", origin);
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  }),
);

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.json({ success: true, message: "pong", timestamp: new Date().toISOString() });
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/services", serviceRoutes);
app.use("/api/sub-services", subServiceRoutes);
app.use("/api/sub-services1", subServices1Routes);
app.use("/api/sub-services2", subService2Routes);
app.use("/api/sub-services3", subService3Routes);
app.use("/api/reviews", reviewroutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/provider", provideroutes);
app.use("/api/admin", adminRouter);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

server.listen(ServerConfig.PORT, async () => {
  await connectDB();
  console.log(`Server started at port ${ServerConfig.PORT}...!!`);
});
