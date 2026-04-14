/**
 * Seed Script: Test Providers
 * -----------------------------------------------
 * Run with: node src/scripts/seedProvider.js
 */

"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../schema/userSchema");
const SubService = require("../schema/Subservice_schema");

async function seedProviders() {
  const DB_URI = process.env.DB_URL;
  if (!DB_URI) {
    console.error("❌ DB_URL is not set in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB…");
  await mongoose.connect(DB_URI);
  console.log("✅ Connected.\n");

  // Get all subservices so we can assign them to our test providers
  const subServices = await SubService.find({});
  if (subServices.length === 0) {
    console.warn("⚠️ No subservices found to assign. Did you run seedElectrician.js first?");
  }

  const providerServices = subServices.map((ss) => ({
    serviceId: ss.serviceId,
    subServiceId: ss._id,
  }));

  const testProviders = [
    {
      name: "Lakman Sharma (Test Provider)",
      email: "lakman.test@doez.com",
      password: await bcrypt.hash("password123", 10),
      phone: "9999999991",
      role: "provider",
      kycStatus: "approved",
      experienceYears: 5,
      rates: 250,
      workArea: "Jamshedpur",
      availability: "online",
      providerServices: providerServices,
    },
    {
      name: "Raju Electrician (Test Provider)",
      email: "raju.test@doez.com",
      password: await bcrypt.hash("password123", 10),
      phone: "9999999992",
      role: "provider",
      kycStatus: "approved",
      experienceYears: 8,
      rates: 300,
      workArea: "Jamshedpur",
      availability: "online",
      providerServices: providerServices,
    },
  ];

  for (const provider of testProviders) {
    const exists = await User.findOne({ email: provider.email });
    if (exists) {
      // Just update them to ensure they have all services and are approved
      await User.updateOne({ _id: exists._id }, { $set: { providerServices: provider.providerServices, kycStatus: "approved" }});
      console.log(`ℹ️ Updated existing provider: ${provider.name}`);
    } else {
      await User.create(provider);
      console.log(`✅ Created Provider: ${provider.name}`);
    }
  }

  console.log("\n──────────────────────────────────────────────────");
  console.log("🎉 Seeding complete!");
  console.log(`   Assigned ${providerServices.length} sub-services to test providers.`);
  console.log("──────────────────────────────────────────────────\n");

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB.");
  process.exit(0);
}

seedProviders().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  mongoose.disconnect().finally(() => process.exit(1));
});
