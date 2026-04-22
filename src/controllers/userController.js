// src/controllers/userController.js
const {
  getUserProfile,
  updateUserProfile,
} = require("../services/userService");
const { registerAndLogin, resetPassword } = require("../services/authService");
const { sendOtp, verifyOtp } = require("../services/otpService");
const { findUser } = require("../repositories/userRepository");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

async function getProfile(req, res) {
  try {
    const user = await getUserProfile(req.user.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.reason });
  }
}

async function updateProfile(req, res) {
  try {
    delete req.body.role;
    delete req.body._id;
    const updated = await updateUserProfile(req.user.id, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.reason });
  }
}

async function sendOtpToUser(req, res) {
  try {
    const { email } = req.body;
    const forceResend = req.body.forceResend === true;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    await sendOtp(email, forceResend);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (e) {
    console.error("[sendOtpToUser Error]:", e);
    return res
      .status(e.statusCode || 500)
      .json({ success: false, message: e.reason || e.message || "Failed to send OTP" });
  }
}

async function verifyUserOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    await verifyOtp(email, otp);
    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, message: e.reason || "OTP verification failed" });
  }
}

async function createUser(req, res) {
  try {
    const result = await registerAndLogin(req.body);

    // Auto-login after registration
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "Registered and logged in successfully",
      data: result.userData,
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      success: false,
      message: e.reason || e.message,
    });
  }
}


async function getAllUsers(req, res) {
  try {
    return res
      .status(200)
      .json({ success: true, data: await getAllUsersService() });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await require("../services/userService").changePassword(req.user.id, oldPassword, newPassword);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.reason });
  }
}

async function uploadProfileImage(req, res) {
  try {
    if (!req.file) throw { reason: "No image provided", statusCode: 400 };
    const imageUrl = await uploadToCloudinary(req.file.path, "ezfix/profile_images");
    await require("../services/userService").updateUserProfile(req.user.id, { profileImage: imageUrl });
    return res.status(200).json({ success: true, data: { profileImage: imageUrl } });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.reason });
  }
}

async function sendForgotPasswordOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Verify that the user actually exists before sending OTP
    const user = await findUser({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email." });
    }

    const forceResend = req.body.forceResend === true;
    await sendOtp(email, forceResend, user.name);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (e) {
    console.error("[sendForgotPasswordOtp Error]:", e);
    return res
      .status(e.statusCode || 500)
      .json({ success: false, message: e.reason || e.message || "Failed to send OTP" });
  }
}

async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }
    // Verify without deleting so it can be consumed in the reset step
    await verifyOtp(email, otp, true);
    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, message: e.reason || "OTP verification failed" });
  }
}

async function resetUserPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are all required.",
      });
    }

    // 1. Verify OTP first (this also deletes the OTP record)
    await verifyOtp(email, otp);

    // 2. Reset the password
    const result = await resetPassword(email, newPassword);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, message: e.reason || "Password reset failed" });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  createUser,
  sendOtpToUser,
  verifyUserOtp,
  getAllUsers,
  changePassword,
  uploadProfileImage,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetUserPassword,
};
