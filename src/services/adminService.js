const bcrypt = require("bcrypt");
const { createAdmin, getAllAdmins, updateAdmin, toggleAdminStatus } = require("../repositories/adminRepository");
const User = require("../schema/userSchema");

async function addAdmin(adminDetails) {
    const existingByEmail = await User.findOne({ email: adminDetails.email });
    const existingByPhone = await User.findOne({ phone: adminDetails.phone });

    if (existingByEmail) {
        throw new Error("Email already exists. Please use another email.");
    }

    if (existingByPhone) {
        throw new Error("Phone number already exists. Please enter another number.");
    }
    const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
    const adminPayload = {
        name: adminDetails.name,
        email: adminDetails.email,
        password: hashedPassword,
        role: adminDetails.role || "admin"
    };

    if (adminDetails.phone && adminDetails.phone.trim() !== "") {
        adminPayload.phone = adminDetails.phone;
    }

    const newAdmin = await createAdmin(adminPayload);

    return newAdmin;
}

async function fetchAllAdmins() {
    return await getAllAdmins();
}

async function modifyAdmin(id, data) {
    return await updateAdmin(id, data);
}

async function toggleStatus(id) {
    return await toggleAdminStatus(id);
}

async function getCommissionStats() {
    const Booking = require("../schema/booking_schema");
    const User = require("../schema/userSchema");

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const tenDaysAgo = new Date(startOfToday.getTime() - 9 * 24 * 60 * 60 * 1000);

    // Aggregate total commission
    const totalStats = await Booking.aggregate([
        { $match: { status: "Completed" } },
        {
            $group: {
                _id: null,
                totalCommission: { $sum: "$commissionAmount" },
                totalBusiness: { $sum: "$amount" },
                jobCount: { $sum: 1 }
            }
        }
    ]);

    // Today's stats
    const todayStats = await Booking.aggregate([
        { $match: { status: "Completed", createdAt: { $gte: startOfToday } } },
        {
            $group: {
                _id: null,
                amount: { $sum: "$amount" },
                commission: { $sum: "$commissionAmount" }
            }
        }
    ]);

    // Yesterday's stats
    const yesterdayStats = await Booking.aggregate([
        { $match: { status: "Completed", createdAt: { $gte: startOfYesterday, $lt: startOfToday } } },
        {
            $group: {
                _id: null,
                amount: { $sum: "$amount" },
                commission: { $sum: "$commissionAmount" }
            }
        }
    ]);

    // Last 10 days stats
    const tenDaysStats = await Booking.aggregate([
        { $match: { status: "Completed", createdAt: { $gte: tenDaysAgo } } },
        {
            $group: {
                _id: null,
                amount: { $sum: "$amount" },
                commission: { $sum: "$commissionAmount" }
            }
        }
    ]);

    // Aggregate by provider
    const providerStats = await Booking.aggregate([
        { $match: { status: "Completed" } },
        {
            $group: {
                _id: "$provider_id",
                totalCommission: { $sum: "$commissionAmount" },
                totalBusiness: { $sum: "$amount" },
                jobCount: { $sum: 1 }
            }
        },
        { $sort: { totalCommission: -1 } }
    ]);

    // Populate provider names
    const populatedProviderStats = await User.populate(providerStats, {
        path: "_id",
        select: "name email phone"
    });

    return {
        overall: {
            ...(totalStats[0] || { totalCommission: 0, totalBusiness: 0, jobCount: 0 }),
            todayAmount: todayStats[0]?.amount || 0,
            todayCommission: todayStats[0]?.commission || 0,
            yesterdayAmount: yesterdayStats[0]?.amount || 0,
            yesterdayCommission: yesterdayStats[0]?.commission || 0,
            tenDaysAmount: tenDaysStats[0]?.amount || 0,
            tenDaysCommission: tenDaysStats[0]?.commission || 0
        },
        providers: populatedProviderStats
    };
}

async function getProviderCommissionDetails(providerId) {
    const Booking = require("../schema/booking_schema");
    // Ensure all models are registered
    require("../schema/Service_schema");
    require("../schema/Subservice_schema");
    require("../schema/Sub_services1_schema");
    require("../schema/Sub_service2_schema");
    require("../schema/Sub_service3_schema");

    const bookings = await Booking.find({
        provider_id: providerId,
        status: "Completed"
    })
        .populate({
            path: "service_id",
            populate: [
                { path: "serviceId", select: "name" },
                { path: "subServiceId", select: "name" },
                { path: "subService1Id", select: "name" },
                { path: "subService2Id", select: "name" }
            ]
        })
        .sort({ createdAt: -1 });

    return bookings;
}

module.exports = {
    addAdmin,
    fetchAllAdmins,
    modifyAdmin,
    toggleStatus,
    getCommissionStats,
    getProviderCommissionDetails
};

