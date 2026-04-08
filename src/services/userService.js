// src/services/userService.js
const { findUser, createUser, findUserById, updateUserById } = require("../repositories/userRepository");
const { findOtp } = require("../repositories/otpRepository");
const bcrypt = require("bcrypt");

async function getUserProfile(userId) {
  try {
    const user = await findUserById(userId);
    if (!user) throw { reason: "User not found", statusCode: 400 };
    return user;
  } catch (error) {
    throw { reason: error.reason || "Failed to fetch user profile", statusCode: error.statusCode || 500 };
  }
}

async function updateUserProfile(id, updatedData) {
  try {
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    delete updatedData.role; delete updatedData._id;
    const updatedUser = await updateUserById(id, updatedData);
    if (!updatedUser) throw { reason: "User not found or update failed", statusCode: 400 };
    return updatedUser;
  } catch (error) {
    let reason = "Failed to update user profile";
    if (error.code === 11000) reason = "Email or phone already exists";
    else if (error.name === 'ValidationError') reason = error.message;
    throw { reason, statusCode: error.statusCode || 400 };
  }
}

async function registerUser(userDetails) {
  let { email, phone, password } = userDetails;
  if (phone) phone = phone.replace(/\D/g, "");

  const existing =
    (await findUser({ email })) || (await findUser({ phone }));

  if (existing) {
    throw {
      reason: "User with this email or phone already exists",
      statusCode: 400,
    };
  }

  const otpStillExists = await findOtp(phone);
  if (otpStillExists) {
    throw {
      reason: "Phone number not verified. Please verify OTP.",
      statusCode: 400,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userPayload = {
    ...userDetails,
    password: hashedPassword,
    isVerified: true,
  };

  if (phone && phone.trim() !== "") {
    userPayload.phone = phone;
  } else {
    delete userPayload.phone;
  }

  return createUser(userPayload);
}

async function changePassword(userId, oldPassword, newPassword) {
  try {
    const user = await findUserById(userId);
    if (!user) throw { reason: "User not found", statusCode: 404 };

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw { reason: "Incorrect old password", statusCode: 400 };

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await updateUserById(userId, { password: hashedNewPassword });
    return { message: "Password updated successfully" };
  } catch (error) {
    throw { reason: error.reason || "Failed to change password", statusCode: error.statusCode || 500 };
  }
}

async function getAllUsersService() {
  return await require("../repositories/userRepository").getAllUsers();
}
module.exports = { getUserProfile, updateUserProfile, registerUser, getAllUsersService, changePassword };
