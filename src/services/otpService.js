/**
 * otpService.js — Production-Grade Email OTP Service
 *
 * Primary:  Brevo Transactional REST API (xkeysib-...) — best inbox delivery
 * Fallback: Brevo SMTP relay (xsmtpsib-...) — if API fails
 *
 * OTP is hashed with bcrypt before storing in MongoDB.
 * OTP is deleted from DB after successful verification.
 */

const bcrypt = require("bcrypt");
const https = require("https");
const nodemailer = require("nodemailer");
const { saveOtp, findOtp, deleteOtp } = require("../repositories/otpRepository");

// Ensure dotenv is loaded
require("../config/serverConfig");

// ─── Email HTML Template (DoEz / Fixerly Brand) ─────────────────────────────

function buildEmailHtml(otp, name) {
  const digits = otp.split("");
  const otpBoxes = digits
    .map(
      (d) =>
        `<td style="width:48px;height:56px;background:#ffffff;border:2px solid #e2e8f0;border-radius:12px;text-align:center;font-size:28px;font-weight:800;color:#0d9488;font-family:'Segoe UI',Arial,sans-serif;">${d}</td>`
    )
    .join('<td style="width:8px;"></td>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Verify your email — DoEz</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:32px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.06);">

        <!-- Gradient Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0d9488 0%,#14b8a6 40%,#f97316 100%);padding:40px 40px 32px;text-align:center;">
            <!-- Logo Circle -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom:16px;">
              <tr><td style="width:60px;height:60px;background:rgba(255,255,255,0.2);border-radius:16px;text-align:center;line-height:60px;">
                <span style="font-size:30px;font-weight:900;color:#ffffff;vertical-align:middle;">D</span>
              </td></tr>
            </table>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.3px;">DoEz / Fixerly</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;font-weight:500;">Trusted Home Services Platform</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 20px;">
            <!-- Greeting -->
            <p style="margin:0 0 6px;color:#0d9488;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Email Verification</p>
            <h2 style="margin:0 0 16px;color:#111827;font-size:24px;font-weight:800;line-height:1.3;">Enter your verification code</h2>
            ${name ? `<p style="margin:0 0 8px;color:#111827;font-size:16px;font-weight:600;">Hi ${name},</p>` : ''}
            <p style="margin:0 0 32px;color:#64748b;font-size:15px;line-height:1.7;">
              We received a request to verify your email for <strong style="color:#111827;">DoEz</strong>. Use the code below to complete your verification. It expires in <strong style="color:#0d9488;">5 minutes</strong>.
            </p>

            <!-- OTP Digits -->
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 32px;">
              <tr>
                ${otpBoxes}
              </tr>
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
              <tr><td style="height:1px;background:linear-gradient(to right,transparent,#e2e8f0,transparent);"></td></tr>
            </table>

            <!-- Security Notice -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdfa;border-radius:14px;margin-bottom:20px;">
              <tr>
                <td style="padding:16px 20px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="vertical-align:top;padding-right:12px;">
                        <span style="font-size:20px;">&#128274;</span>
                      </td>
                      <td>
                        <p style="margin:0 0 4px;color:#0f766e;font-size:13px;font-weight:700;">Security Notice</p>
                        <p style="margin:0;color:#5eead4;font-size:12px;line-height:1.5;color:#64748b;">Never share this code with anyone. DoEz team will never ask for your OTP via call, SMS, or email.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
              If you didn't request this code, please ignore this email. Your account is safe.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #f1f5f9;padding-top:24px;">
              <tr>
                <td align="center">
                  <p style="margin:0 0 8px;color:#94a3b8;font-size:11px;font-weight:600;letter-spacing:0.5px;">POWERED BY</p>
                  <p style="margin:0 0 4px;color:#64748b;font-size:14px;font-weight:700;">DoEz / Fixerly</p>
                  <p style="margin:0;color:#cbd5e1;font-size:11px;">&copy; 2025 All rights reserved</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>

      <!-- Sub-footer -->
      <table width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:100%;margin-top:20px;">
        <tr>
          <td align="center">
            <p style="margin:0;color:#94a3b8;font-size:11px;line-height:1.6;">
              This is an automated email from DoEz. Please do not reply.
            </p>
          </td>
        </tr>
      </table>

    </td></tr>
  </table>

</body>
</html>`;
}

// ─── Brevo REST API Email Sender ─────────────────────────────────────────────

function sendViaBrevoAPI(toEmail, otp, name) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    if (!apiKey) {
      return reject(new Error("BREVO_API_KEY not set"));
    }

    const payload = JSON.stringify({
      sender: { name: "DoEz / Fixerly", email: senderEmail },
      to: [{ email: toEmail }],
      subject: "Your DoEz Verification Code",
      htmlContent: buildEmailHtml(otp, name),
      textContent: `Your DoEz OTP is: ${otp}\nThis code expires in 5 minutes. Do not share it.`,
    });

    const options = {
      hostname: "api.brevo.com",
      port: 443,
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.messageId || "sent");
          } catch {
            resolve("sent");
          }
        } else {
          reject(new Error(`Brevo API ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.on("timeout", () => { req.destroy(); reject(new Error("Brevo API timeout")); });
    req.write(payload);
    req.end();
  });
}

// ─── SMTP Fallback Sender ────────────────────────────────────────────────────

async function sendViaSMTP(toEmail, otp, name) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP config missing");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false,
    requireTLS: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const senderEmail = process.env.SMTP_FROM_EMAIL || SMTP_USER;

  const info = await transporter.sendMail({
    from: `"DoEz / Fixerly" <${senderEmail}>`,
    to: toEmail,
    subject: "Your DoEz Verification Code",
    text: `Your DoEz OTP is: ${otp}\nExpires in 5 minutes. Do not share.`,
    html: buildEmailHtml(otp, name),
  });

  return info.messageId;
}

// ─── Core OTP Functions ──────────────────────────────────────────────────────

/**
 * Sends a 6-digit OTP to the given email address.
 * OTP is saved to MongoDB (hashed) before email is sent.
 * If email fails, OTP is rolled back (deleted from DB).
 */
async function sendOtp(email, forceResend = false, name = null) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw { reason: "Please enter a valid email address.", statusCode: 400 };
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check for existing OTP
  const existingOtp = await findOtp(normalizedEmail);
  if (existingOtp && existingOtp.expiresAt > new Date() && !forceResend) {
    throw {
      reason: "An OTP was already sent. Use Resend OTP to get a fresh one.",
      statusCode: 429,
    };
  }

  // Clear any existing OTP
  if (existingOtp) {
    await deleteOtp(normalizedEmail);
    console.log(`[OTP] Cleared old OTP for ${normalizedEmail}`);
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Save to DB first
  await saveOtp(normalizedEmail, hashedOtp, expiresAt);
  console.log(`[OTP] Saved to DB for ${normalizedEmail} — expires ${expiresAt.toISOString()}`);

  // Send email — try REST API first, fall back to SMTP
  try {
    const messageId = await sendViaBrevoAPI(normalizedEmail, otp, name);
    console.log(`[OTP] ✅ Brevo API → ${normalizedEmail} | ID: ${messageId}`);
  } catch (apiError) {
    console.warn(`[OTP] ⚠️ Brevo API failed: ${apiError.message} — trying SMTP...`);
    try {
      const smtpId = await sendViaSMTP(normalizedEmail, otp, name);
      console.log(`[OTP] ✅ SMTP fallback → ${normalizedEmail} | ID: ${smtpId}`);
    } catch (smtpError) {
      // Both failed — rollback DB
      await deleteOtp(normalizedEmail);
      console.error(`[OTP] ❌ All delivery failed for ${normalizedEmail}:`, smtpError.message);
      throw {
        reason: "Could not send OTP email. Please try again.",
        statusCode: 500,
      };
    }
  }
}

/**
 * Verifies the OTP code entered by the user.
 * Compares against the bcrypt hash stored in MongoDB.
 * Deletes the OTP record after successful verification.
 */
async function verifyOtp(email, enteredOtp, keepAfterVerify = false) {
  if (!email || !enteredOtp) {
    throw { reason: "Email and OTP are required.", statusCode: 400 };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedOtp = String(enteredOtp).trim();

  if (!/^\d{6}$/.test(normalizedOtp)) {
    throw { reason: "OTP must be a 6-digit number.", statusCode: 400 };
  }

  const otpDoc = await findOtp(normalizedEmail);
  if (!otpDoc) {
    throw { reason: "OTP not found or already used. Please request a new one.", statusCode: 400 };
  }

  if (otpDoc.expiresAt < new Date()) {
    await deleteOtp(normalizedEmail);
    throw { reason: "OTP has expired. Please request a new one.", statusCode: 400 };
  }

  const isMatch = await bcrypt.compare(normalizedOtp, otpDoc.otp);
  if (!isMatch) {
    throw { reason: "Incorrect OTP. Please check and try again.", statusCode: 400 };
  }

  if (!keepAfterVerify) {
    await deleteOtp(normalizedEmail);
    console.log(`[OTP] ✅ Verified for ${normalizedEmail} (deleted)`);
  } else {
    console.log(`[OTP] ✅ Verified for ${normalizedEmail} (kept for later consume)`);
  }
  
  return true;
}

module.exports = { sendOtp, verifyOtp };
