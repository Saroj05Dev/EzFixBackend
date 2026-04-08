const {
  updateUserById,
  findUserById,
  getAllProviders,
} = require("../repositories/userRepository");
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const fs = require("fs");
const User = require("../schema/userSchema");
const Service = require("../schema/Service_schema");
const SubService = require("../schema/Subservice_schema");
async function onboardProvider(userId, data) {
  return await updateUserById(userId, {
    role: "provider",
    kycStatus: null,
    rates: data.rates,
    workArea: data.workArea,
    experienceYears: data.experienceYears,
    availability: "offline",
  });
}

async function getProviderProfile(id) {
  const user = await User.findById(id)
    .select("-password")
    .populate("providerServices.serviceId")
    .populate("providerServices.subServiceId");
  if (!user || user.role !== "provider")
    throw { reason: "Provider not found", statusCode: 404 };
  return user;
}

async function updateProviderProfile(id, data) {
  const allowed = [
    "rates",
    "workArea",
    "experienceYears",
    "aadharNumber",
    "panNumber",
    "bankDetails",
  ];
  const updates = {};
  allowed.forEach((k) => {
    if (data[k] !== undefined) updates[k] = data[k];
  });
  return await updateUserById(id, updates);
}

async function toggleAvailability(id, status) {
  if (!["online", "offline"].includes(status))
    throw { reason: "Invalid status", statusCode: 400 };
  return await updateUserById(id, { availability: status });
}

async function getEarnings(id) {
  const Booking = require("../schema/booking_schema");
  const now = new Date();

  // Calculate relative dates
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const stats = await Booking.aggregate([
    {
      $match: {
        provider_id: new mongoose.Types.ObjectId(id),
        status: "Completed"
      }
    },
    {
      $facet: {
        total: [
          { $group: { _id: null, amount: { $sum: "$amount" }, count: { $sum: 1 } } }
        ],
        today: [
          { $match: { updatedAt: { $gte: startOfToday } } },
          { $group: { _id: null, amount: { $sum: "$amount" } } }
        ],
        yesterday: [
          { $match: { updatedAt: { $gte: startOfYesterday, $lt: startOfToday } } },
          { $group: { _id: null, amount: { $sum: "$amount" } } }
        ],
        monthly: [
          { $match: { updatedAt: { $gte: startOfMonth } } },
          { $group: { _id: null, amount: { $sum: "$amount" } } }
        ],
        daily: [
          { $match: { updatedAt: { $gte: sevenDaysAgo } } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
              amount: { $sum: "$amount" }
            }
          },
          { $sort: { _id: 1 } }
        ]
      }
    }
  ]);

  const facetResult = stats[0] || {};

  // Fill in missing days for the chart
  const dailyEarnings = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const match = facetResult.daily?.find(item => item._id === dateStr);
    dailyEarnings.push({
      date: dateStr,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      amount: match ? match.amount : 0
    });
  }

  return {
    completedJobs: facetResult.total?.[0]?.count || 0,
    totalEarnings: facetResult.total?.[0]?.amount || 0,
    todayEarnings: facetResult.today?.[0]?.amount || 0,
    yesterdayEarnings: facetResult.yesterday?.[0]?.amount || 0,
    monthlyEarnings: facetResult.monthly?.[0]?.amount || 0,
    dailyEarnings
  };
}

async function handleKycUpload(userId, files) {
  const provider = await findUserById(userId);
  if (!provider) throw { reason: "Provider not found", statusCode: 404 };

  const uploadedUrls = [];

  for (const file of files) {
    const secureUrl = await uploadToCloudinary(file.path, "fixerly/kyc_docs");
    uploadedUrls.push(secureUrl);
  }

  // Merge existing docs + set status
  const updatedProvider = await updateUserById(userId, {
    kycDocs: [...(provider.kycDocs || []), ...uploadedUrls],
    kycStatus: "pending",
  });

  return updatedProvider;
}

// only for admins
async function listAllProviders() {
  return await User.find({ role: "provider" })
    .select("-password")
    .populate("providerServices.serviceId")
    .populate("providerServices.subServiceId");
}
// admin create provider
async function createProvider(data) {
  const providerData = {
    ...data,
    role: "provider",
    availability: "offline",
  };

  // Prevent duplicate null/empty strings for phone
  if (!providerData.phone || providerData.phone.trim() === "") {
    delete providerData.phone;
  }

  return await User.create(providerData);
}

// admin update provider
async function adminUpdateProvider(id, data) {
  return await updateUserById(id, data);
}

// admin delete provider
async function deleteProvider(id) {
  const user = await findUserById(id);
  if (!user || user.role !== "provider") {
    throw { reason: "Provider not found", statusCode: 404 };
  }
  return await User.findByIdAndDelete(id);
}

async function submitFullKyc(userId, data, files) {
  const provider = await findUserById(userId);
  if (!provider) throw { reason: "Provider not found", statusCode: 404 };

  const updates = {
    aadharNumber: data.aadharNumber,
    panNumber: data.panNumber,
    bankDetails: {
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
    },
    kycStatus: "pending",
  };

  // Handle file uploads to Cloudinary with local fallback
  if (files.aadharFile && files.aadharFile[0]) {
    try {
      updates.aadharFile = await uploadToCloudinary(
        files.aadharFile[0].path,
        "fixerly/kyc_docs",
      );
    } catch (err) {
      console.error("Aadhar file upload to Cloudinary failed:", err.message);
      // Use local file URL as fallback
      const filename = files.aadharFile[0].filename;
      updates.aadharFile = `/uploads/${filename}`;
      console.log("Using local file URL:", updates.aadharFile);
    }
  }

  if (files.panFile && files.panFile[0]) {
    try {
      updates.panFile = await uploadToCloudinary(
        files.panFile[0].path,
        "fixerly/kyc_docs",
      );
    } catch (err) {
      console.error("PAN file upload to Cloudinary failed:", err.message);
      // Use local file URL as fallback
      const filename = files.panFile[0].filename;
      updates.panFile = `/uploads/${filename}`;
      console.log("Using local file URL:", updates.panFile);
    }
  }

  if (files.passbookImage && files.passbookImage[0]) {
    try {
      updates["bankDetails.passbookImage"] = await uploadToCloudinary(
        files.passbookImage[0].path,
        "fixerly/kyc_docs",
      );
    } catch (err) {
      console.error("Passbook image upload to Cloudinary failed:", err.message);
      // Use local file URL as fallback
      const filename = files.passbookImage[0].filename;
      updates["bankDetails.passbookImage"] = `/uploads/${filename}`;
      console.log(
        "Using local file URL:",
        updates["bankDetails.passbookImage"],
      );
    }
  }

  // Use a special way to update nested bankDetails or just overwrite it
  // Since we are setting all bankDetails, we can just do:
  updates.bankDetails = {
    accountNumber: data.accountNumber,
    ifscCode: data.ifscCode,
    passbookImage:
      updates["bankDetails.passbookImage"] ||
      provider.bankDetails?.passbookImage,
  };
  delete updates["bankDetails.passbookImage"];

  return await updateUserById(userId, updates);
}

// admin approve/reject kyc
async function approveKyc(id, status) {
  if (!["approved", "rejected", "pending"].includes(status)) {
    throw { reason: "Invalid KYC status", statusCode: 400 };
  }
  return await updateUserById(id, { kycStatus: status });
}

// Update provider services
async function updateProviderServices(userId, data) {
  const provider = await findUserById(userId);
  if (!provider) throw { reason: "Provider not found", statusCode: 404 };

  const updates = {
    providerServices: data.services,
  };

  if (data.workArea) updates.workArea = data.workArea;
  if (data.experienceYears) updates.experienceYears = data.experienceYears;

  return await updateUserById(userId, updates);
}

const SubService3 = require("../schema/Sub_service3_schema");

// Get providers by specific service ID (SubService3)
// Get providers by specific service ID (SubService3)
async function getProvidersByServiceId(subService3Id) {
  // First, find the subService3 to get its parent subServiceId
  const subService3 = await SubService3.findById(subService3Id);
  if (!subService3) return [];

  const targetSubServiceId = subService3.subServiceId;

  return await User.find({
    role: "provider",
    kycStatus: "approved", // Only show approved providers
    "providerServices.subServiceId": targetSubServiceId,
  }).select("name rates experienceYears workArea providerServices");
}

async function uploadPaymentQrCode(userId, file) {
  const provider = await findUserById(userId);
  if (!provider) throw { reason: "Provider not found", statusCode: 404 };

  let qrUrl = "";
  try {
    qrUrl = await uploadToCloudinary(file.path, "fixerly/payment_qrs");
  } catch (err) {
    console.error("Payment QR upload to Cloudinary failed:", err.message);
    const filename = file.filename;
    qrUrl = `/uploads/${filename}`;
  }

  return await updateUserById(userId, { paymentQrCode: qrUrl });
}

module.exports = {
  onboardProvider,
  getProviderProfile,
  updateProviderProfile,
  toggleAvailability,
  getEarnings,
  handleKycUpload,
  submitFullKyc,
  listAllProviders,
  createProvider,
  adminUpdateProvider,
  deleteProvider,
  approveKyc,
  updateProviderServices,
  getProvidersByServiceId,
  uploadPaymentQrCode,
};
