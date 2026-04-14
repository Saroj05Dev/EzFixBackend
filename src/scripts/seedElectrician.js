/**
 * Seed Script: Electrician Service Data
 * -----------------------------------------------
 * Hierarchy:
 *   Service → SubService → SubService1 → SubService2 → SubService3
 *
 * Run with:  node src/scripts/seedElectrician.js
 */

"use strict";

require("dotenv").config();
const mongoose = require("mongoose");

// ── Schema Imports ────────────────────────────────────────────────────────────
const Service    = require("../schema/Service_schema");
const SubService = require("../schema/Subservice_schema");
const SubService1 = require("../schema/Sub_services1_schema");
const SubService2  = require("../schema/Sub_service2_schema");
const SubService3  = require("../schema/Sub_service3_schema");

// ── Cloudinary placeholder image (public URL – no upload needed for seed) ────
// Using a reliable public electrician icon from Cloudinary CDN.
const ELECTRICIAN_IMAGE =
  "https://res.cloudinary.com/dr23zxxj7/image/upload/v1/doez/electrician_placeholder";

// ── Raw Data ──────────────────────────────────────────────────────────────────
/**
 * Structure:
 * [
 *   {
 *     subService: { name, description },
 *     subService1: { name },            ← label under subService
 *     subService2: { name },            ← grouping under subService1
 *     items: [                          ← SubService3 leaf nodes
 *       { name, minPrice, maxPrice, description }
 *     ]
 *   }
 * ]
 */
const ELECTRICIAN_DATA = [
  // ── 1. Small Home Work ───────────────────────────────────────────────────
  {
    subService: {
      name: "Small Home Work",
      description:
        "Quick household electrical repairs – visit & labour included in all prices.",
    },
    subService1: { name: "Small Home Work Tasks" },
    subService2: { name: "Basic Repair & Replacement" },
    items: [
      {
        name: "Bulb Change",
        minPrice: 100,
        maxPrice: 200,
        description:
          "Replace a faulty or blown bulb (any type). Visit + labour included.",
      },
      {
        name: "Tube Light Installation",
        minPrice: 150,
        maxPrice: 250,
        description:
          "Remove old tube light & install new tube light with starter/choke. Labour included.",
      },
      {
        name: "Switch / Socket Repair",
        minPrice: 150,
        maxPrice: 300,
        description:
          "Diagnose and repair or replace a faulty switch or wall socket. Labour included.",
      },
      {
        name: "MCB Replacement",
        minPrice: 150,
        maxPrice: 300,
        description:
          "Replace a tripped or faulty Miniature Circuit Breaker (MCB). Labour included.",
      },
      {
        name: "Fan Capacitor Replacement",
        minPrice: 150,
        maxPrice: 300,
        description:
          "Replace a faulty ceiling fan capacitor to restore proper fan speed. Labour included.",
      },
    ],
  },

  // ── 2. Fan & Basic Appliance ─────────────────────────────────────────────
  {
    subService: {
      name: "Fan & Basic Appliance",
      description:
        "Installation and replacement of fans and basic electrical appliances.",
    },
    subService1: { name: "Fan & Appliance Tasks" },
    subService2: { name: "Fan Installation & Replacement" },
    items: [
      {
        name: "Ceiling Fan Installation",
        minPrice: 200,
        maxPrice: 400,
        description:
          "Install a new ceiling fan on an existing hook – wiring & balancing included.",
      },
      {
        name: "Ceiling Fan Replacement",
        minPrice: 250,
        maxPrice: 450,
        description:
          "Remove old ceiling fan and install the new one; includes electrical connection.",
      },
      {
        name: "Exhaust Fan Installation",
        minPrice: 200,
        maxPrice: 350,
        description:
          "Mount and wire an exhaust fan in kitchen or bathroom. Labour included.",
      },
      {
        name: "Decorative / Designer Fan Installation",
        minPrice: 400,
        maxPrice: 700,
        description:
          "Install a decorative or designer ceiling fan; heavier fans with remote/canopy included.",
      },
    ],
  },

  // ── 3. Switchboard & Points ──────────────────────────────────────────────
  {
    subService: {
      name: "Switchboard & Points",
      description:
        "New electrical point creation and switchboard fitting. Labour & fitting included – material may be extra.",
    },
    subService1: { name: "Switchboard & Point Work" },
    subService2: { name: "Point Creation & Board Fitting" },
    items: [
      {
        name: "Light Point Creation",
        minPrice: 300,
        maxPrice: 600,
        description:
          "Create a new light point with wiring from the nearest DB / existing circuit. Material extra.",
      },
      {
        name: "Fan Point Creation",
        minPrice: 300,
        maxPrice: 500,
        description:
          "Create a new fan point including hook, wiring, and switch. Material extra.",
      },
      {
        name: "Power Socket (15A) Installation",
        minPrice: 400,
        maxPrice: 700,
        description:
          "Install a heavy-duty 15A socket for AC, geysers, etc. Labour + fitting included.",
      },
      {
        name: "Switchboard Installation",
        minPrice: 300,
        maxPrice: 600,
        description:
          "Fix and wire a new modular or conventional switchboard. Labour included.",
      },
    ],
  },

  // ── 4. Lighting Work ─────────────────────────────────────────────────────
  {
    subService: {
      name: "Lighting Work",
      description:
        "All types of indoor and outdoor lighting installation.",
    },
    subService1: { name: "Lighting Installation" },
    subService2: { name: "Indoor & Outdoor Lighting" },
    items: [
      {
        name: "LED / Bulb Installation",
        minPrice: 150,
        maxPrice: 250,
        description:
          "Install LED strip, panel light, or bulb in existing holder. Labour included.",
      },
      {
        name: "False Ceiling Light Installation",
        minPrice: 250,
        maxPrice: 500,
        description:
          "Install LED downlights or spotlights in false ceiling cutouts. Labour included.",
      },
      {
        name: "Chandelier Installation",
        minPrice: 800,
        maxPrice: 1500,
        description:
          "Install and wire a chandelier/jhoomar including hook fitting and wiring.",
      },
      {
        name: "Outdoor / Garden Light Installation",
        minPrice: 700,
        maxPrice: 1200,
        description:
          "Install outdoor wall lights, garden lights, or floodlights with weatherproof wiring.",
      },
    ],
  },

  // ── 5. Heavy Appliance ───────────────────────────────────────────────────
  {
    subService: {
      name: "Heavy Appliance",
      description:
        "Installation of heavy household appliances requiring dedicated wiring.",
    },
    subService1: { name: "Heavy Appliance Installation" },
    subService2: { name: "Geyser, AC & Washing Machine" },
    items: [
      {
        name: "Geyser Installation",
        minPrice: 600,
        maxPrice: 1200,
        description:
          "Wall-mount and wire a water heater / geyser with a dedicated 15A socket & MCB.",
      },
      {
        name: "AC Point & Wiring",
        minPrice: 500,
        maxPrice: 1000,
        description:
          "Create a dedicated AC point with proper gauge wiring from the DB / MCB box.",
      },
      {
        name: "Washing Machine Point Installation",
        minPrice: 400,
        maxPrice: 800,
        description:
          "Install a 15A socket for washing machine with earthing and proper wiring.",
      },
      {
        name: "TV Mounting & Wiring",
        minPrice: 700,
        maxPrice: 1200,
        description:
          "Wall-mount TV on bracket, manage HDMI/cable routing, and fix power point.",
      },
    ],
  },

  // ── 6. Inverter / Backup ─────────────────────────────────────────────────
  {
    subService: {
      name: "Inverter / Backup",
      description:
        "Inverter, UPS, and battery backup installation services.",
    },
    subService1: { name: "Inverter & Battery Setup" },
    subService2: { name: "Inverter Wiring & Installation" },
    items: [
      {
        name: "Inverter Installation",
        minPrice: 800,
        maxPrice: 1500,
        description:
          "Install a home inverter/UPS unit with proper wiring and load distribution.",
      },
      {
        name: "Battery Setup & Connection",
        minPrice: 300,
        maxPrice: 700,
        description:
          "Connect and configure inverter battery with terminals, vents, and safety checks.",
      },
      {
        name: "Full Inverter Wiring",
        minPrice: 1000,
        maxPrice: 2500,
        description:
          "Complete inverter wiring from DB changeover switch to all backup circuits in the home.",
      },
    ],
  },

  // ── 7. Full House Wiring ─────────────────────────────────────────────────
  {
    subService: {
      name: "Full House Wiring",
      description:
        "Complete electrical wiring for new constructions or rewiring projects. Labour + basic installation included.",
    },
    subService1: { name: "House Wiring" },
    subService2: { name: "Per Point & Per Sq Ft Pricing" },
    items: [
      {
        name: "Wiring Per Point",
        minPrice: 400,
        maxPrice: 800,
        description:
          "Cost per electrical point (light / fan / socket) including wiring conduit and box. Labour included.",
      },
      {
        name: "Labour Only (Per Sq Ft)",
        minPrice: 20,
        maxPrice: 40,
        description:
          "Labour-only charge per sq ft for house wiring when material is supplied by the owner.",
      },
      {
        name: "Complete Wiring (Per Sq Ft)",
        minPrice: 150,
        maxPrice: 300,
        description:
          "Full wiring per sq ft including material (wire, conduit, boxes) and labour.",
      },
      {
        name: "1 Room Full Wiring",
        minPrice: 15000,
        maxPrice: 30000,
        description:
          "Complete wiring for a single room including all points, DB, and MCB. Labour + material.",
      },
      {
        name: "1 BHK Full Wiring",
        minPrice: 150000,
        maxPrice: 200000,
        description:
          "Full house wiring for a 1 BHK flat including DB, MCBs, all points. Labour + material.",
      },
      {
        name: "2 BHK Full Wiring",
        minPrice: 200000,
        maxPrice: 300000,
        description:
          "Full house wiring for a 2 BHK flat including DB, MCBs, all points. Labour + material.",
      },
      {
        name: "3 BHK Full Wiring",
        minPrice: 300000,
        maxPrice: 400000,
        description:
          "Full house wiring for a 3 BHK flat including DB, MCBs, all points. Labour + material.",
      },
    ],
  },

  // ── 8. Labour Only ───────────────────────────────────────────────────────
  {
    subService: {
      name: "Labour Only",
      description:
        "Electrician labour services when the customer supplies the material.",
    },
    subService1: { name: "Labour Charges" },
    subService2: { name: "Visit, Hourly & Daily Rates" },
    items: [
      {
        name: "Visit Charge",
        minPrice: 150,
        maxPrice: 300,
        description:
          "One-time visit/inspection charge. Waived if work is assigned to us.",
      },
      {
        name: "Labour – Per Hour",
        minPrice: 200,
        maxPrice: 500,
        description:
          "Electrician labour charge billed per hour for small or miscellaneous jobs.",
      },
      {
        name: "Labour – Full Day",
        minPrice: 800,
        maxPrice: 1500,
        description:
          "Full-day electrician labour (8 hrs) when material is provided by the client.",
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Upload a placeholder image to Cloudinary (or use a fallback URL).
 * For seeding we use a static public URL as uploading a real image
 * from a script is not required.
 */
function getPlaceholderImage() {
  // Use a real publicly accessible electrician icon so the image field is valid.
  return "https://img.icons8.com/color/96/000000/electrician.png";
}

/**
 * Format price range as a string like "₹150 – ₹300"
 */
function formatPriceRange(min, max) {
  return `₹${min} – ₹${max}`;
}

// ── Seed Function ─────────────────────────────────────────────────────────────

async function seed() {
  const DB_URI = process.env.DB_URL;
  if (!DB_URI) {
    console.error("❌  DB_URL is not set in .env");
    process.exit(1);
  }

  console.log("🔌  Connecting to MongoDB…");
  await mongoose.connect(DB_URI);
  console.log("✅  Connected.\n");

  // ── Step 1: Upsert the top-level Service ──────────────────────────────────
  let service = await Service.findOne({ name: "Electrician" });

  if (service) {
    console.log(`ℹ️   Service "Electrician" already exists (${service._id}). Skipping creation.`);
  } else {
    service = await Service.create({
      name: "Electrician",
      image: getPlaceholderImage(),
      price: "₹100 – ₹4,00,000",
      description:
        "Professional electrician services for homes and offices – from simple bulb changes to complete house wiring. All prices include labour unless stated otherwise.",
    });
    console.log(`✅  Created Service: Electrician  (${service._id})`);
  }

  // ── Step 2: Iterate categories and seed the full hierarchy ────────────────
  let totalSubServices3 = 0;
  let skipped = 0;

  for (const category of ELECTRICIAN_DATA) {
    const { subService: ssDef, subService1: ss1Def, subService2: ss2Def, items } = category;

    // SubService ─────────────────────────────────────────────────────────────
    let subService = await SubService.findOne({
      name: ssDef.name,
      serviceId: service._id,
    });

    if (!subService) {
      subService = await SubService.create({
        name: ssDef.name,
        description: ssDef.description,
        serviceId: service._id,
      });
      console.log(`  ✅  SubService: ${ssDef.name}`);
    } else {
      console.log(`  ℹ️   SubService already exists: ${ssDef.name}`);
    }

    // SubService1 ────────────────────────────────────────────────────────────
    let subService1 = await SubService1.findOne({
      name: ss1Def.name,
      serviceId: service._id,
      subServiceId: subService._id,
    });

    if (!subService1) {
      subService1 = await SubService1.create({
        name: ss1Def.name,
        serviceId: service._id,
        subServiceId: subService._id,
      });
      console.log(`    ✅  SubService1: ${ss1Def.name}`);
    } else {
      console.log(`    ℹ️   SubService1 already exists: ${ss1Def.name}`);
    }

    // SubService2 ────────────────────────────────────────────────────────────
    let subService2 = await SubService2.findOne({
      name: ss2Def.name,
      serviceId: service._id,
      subServiceId: subService._id,
      subService1Id: subService1._id,
    });

    if (!subService2) {
      subService2 = await SubService2.create({
        name: ss2Def.name,
        serviceId: service._id,
        subServiceId: subService._id,
        subService1Id: subService1._id,
      });
      console.log(`      ✅  SubService2: ${ss2Def.name}`);
    } else {
      console.log(`      ℹ️   SubService2 already exists: ${ss2Def.name}`);
    }

    // SubService3 (leaf items) ───────────────────────────────────────────────
    for (const item of items) {
      const exists = await SubService3.findOne({
        subService3Name: item.name,
        serviceId: service._id,
        subServiceId: subService._id,
        subService1Id: subService1._id,
        subService2Id: subService2._id,
      });

      if (exists) {
        console.log(`        ⏭️   Already exists: ${item.name}`);
        skipped++;
        continue;
      }

      await SubService3.create({
        subService3Name: item.name,
        image: getPlaceholderImage(),
        price: item.minPrice,                       // store base/min price as number
        description: `${item.description} | Price range: ${formatPriceRange(item.minPrice, item.maxPrice)}`,
        serviceId: service._id,
        subServiceId: subService._id,
        subService1Id: subService1._id,
        subService2Id: subService2._id,
      });

      console.log(`        ✅  ${item.name}  (${formatPriceRange(item.minPrice, item.maxPrice)})`);
      totalSubServices3++;
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n──────────────────────────────────────────────────");
  console.log("🎉  Seeding complete!");
  console.log(`   Service ID  : ${service._id}`);
  console.log(`   Categories  : ${ELECTRICIAN_DATA.length}`);
  console.log(`   Items added : ${totalSubServices3}`);
  console.log(`   Items skipped (already existed): ${skipped}`);
  console.log("──────────────────────────────────────────────────\n");

  await mongoose.disconnect();
  console.log("🔌  Disconnected from MongoDB.");
  process.exit(0);
}

// ── Run ───────────────────────────────────────────────────────────────────────
seed().catch((err) => {
  console.error("❌  Seeding failed:", err.message);
  mongoose.disconnect().finally(() => process.exit(1));
});
