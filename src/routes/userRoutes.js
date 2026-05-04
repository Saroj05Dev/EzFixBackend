const express = require("express");
const {
  createUser,
  sendOtpToUser,
  verifyUserOtp,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetUserPassword,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/userController");

const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

const router = express.Router();

router.post("/register/send-otp", sendOtpToUser);
router.post("/register/verify-otp", verifyUserOtp);
router.post("/", createUser);

// Forgot Password (public — no auth required)
router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
router.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);
router.post("/forgot-password/reset", resetUserPassword);

router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);
router.post("/profile-image", isAuthenticated, upload.single('image'), uploadProfileImage);

// Admin only user management routes
router.get("/", isAuthenticated, isAuthorized(["admin"]), getAllUsers);
router.patch("/status/:id", isAuthenticated, isAuthorized(["admin"]), updateUserStatus);


module.exports = router;
