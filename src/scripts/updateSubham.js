"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../schema/userSchema");
const Service = require("../schema/Service_schema");
const SubService = require("../schema/Subservice_schema");

async function updateSubham() {
  const DB_URI = process.env.DB_URL;
  if (!DB_URI) {
    console.error("❌ DB_URL is not set in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB…");
  await mongoose.connect(DB_URI);
  console.log("✅ Connected.\n");

  const emailToFind = "subham@gmail.com";
  
  // 1. Find Subham
  const user = await User.findOne({ email: emailToFind });
  if (!user) {
    console.error(`❌ User with email ${emailToFind} not found in database!`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // 2. Find the Electrician service and subservices
  const service = await Service.findOne({ name: "Electrician" });
  if (!service) {
    console.error("❌ Electrician service not found in database! Are you sure you seeded it?");
    await mongoose.disconnect();
    process.exit(1);
  }

  const subServices = await SubService.find({ serviceId: service._id });
  
  const providerServices = subServices.map((ss) => ({
    serviceId: ss.serviceId,
    subServiceId: ss._id,
  }));

  // 3. Update the user
  const updates = {
    role: "provider",
    kycStatus: "approved",
    providerServices: providerServices,
    experienceYears: user.experienceYears || 5,
    rates: user.rates || 300,
    workArea: user.workArea || "Jamshedpur",
    availability: "online"
  };

  await User.updateOne({ _id: user._id }, { $set: updates });

  console.log(`✅ Successfully updated ${user.name} (${user.email}) to Electrician Provider!`);
  console.log(`   Assigned ${providerServices.length} sub-services.`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB.");
  process.exit(0);
}

updateSubham().catch((err) => {
  console.error("❌ Failed:", err.message);
  mongoose.disconnect().finally(() => process.exit(1));
});
