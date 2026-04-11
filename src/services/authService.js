const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/serverConfig");
const { findUser, createUser } = require("../repositories/userRepository");
const { findOtp } = require("../repositories/otpRepository");

async function loginUser(authDetails) {
  let { email, password } = authDetails;

  // 1 Check user
  const user = await findUser({ email });
  if (!user) {
    throw { reason: "User not found", statusCode: 400 };
  }

  // 1.5 Check if suspended
  if (user.status === "suspended") {
    throw { reason: "you are suspened by the admin please contant to admin", statusCode: 403 };
  }

  // 2 Verify password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw { reason: "Invalid password", statusCode: 400 };
  }

  const role = user.role || "user";

  // 3 Generate token
  const token = jwt.sign(
    { id: user._id, phone: user.phone, role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    role,
    userData: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
}

async function registerAndLogin(userDetails) {
  let { name, email, phone, password, role } = userDetails;

  // 1 Check duplicates
  const existingEmail = await findUser({ email });
  if (existingEmail) {
    throw {
      reason: "User with this email already exists",
      statusCode: 400,
    };
  }

  if (phone) {
    const existingPhone = await findUser({ phone });
    if (existingPhone) {
      throw {
        reason: "User with this phone already exists",
        statusCode: 400,
      };
    }
  }

  // 2 OTP must be verified (by checking if they cleared the OTP from DB via verfication step)
  // The logic in the original code checks if ANY OTP still exists for the phone to mean it's NOT verified.
  // We will replicate this for email.
  const otpStillExists = await findOtp(email);
  if (otpStillExists) {
    throw {
      reason: "Email not verified. Please verify OTP.",
      statusCode: 400,
    };
  }

  // 3 Validate password (raw)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw { reason: "Weak password", statusCode: 400 };
  }

  // 4 Hash ONCE
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5 Create user
  const userPayload = {
    name,
    email,
    password: hashedPassword,
    role: role || "user",
    isVerified: true,
  };

  if (phone && phone.trim() !== "") {
    userPayload.phone = phone;
  }

  const user = await createUser(userPayload);

  // 6 Auto-login token
  const token = jwt.sign(
    { id: user._id, phone: user.phone, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    role: user.role,
    userData: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  };
}

async function resetPassword(email, newPassword) {
  if (!email) {
    throw { reason: "Email is required.", statusCode: 400 };
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 1 Find the user
  const user = await findUser({ email: normalizedEmail });
  if (!user) {
    throw { reason: "No account found with this email.", statusCode: 404 };
  }

  // 2 Validate password strength (same rule as registration)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    throw {
      reason:
        "Password must be at least 8 characters with uppercase, lowercase, number & special character.",
      statusCode: 400,
    };
  }

  // 3 Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4 Update the user's password
  const { updateUserById } = require("../repositories/userRepository");
  await updateUserById(user._id, { password: hashedPassword });

  return { message: "Password reset successfully." };
}

module.exports = { loginUser, registerAndLogin, resetPassword };
