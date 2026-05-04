const { addAdmin, fetchAllAdmins, modifyAdmin, toggleStatus, getCommissionStats, getProviderCommissionDetails } = require("../services/adminService");
const { getAllUsersService, updateUserStatus } = require("../services/userService");

async function createAdmin(req, res) {
    try {
        const admin = await addAdmin(req.body);
        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: admin
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getAllAdmins(req, res) {
    try {
        const admins = await fetchAllAdmins();
        return res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function updateAdmin(req, res) {
    try {
        const updated = await modifyAdmin(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: updated
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function toggleAdminStatus(req, res) {
    try {
        const updated = await toggleStatus(req.params.id);
        return res.status(200).json({
            success: true,
            message: `Admin status changed to ${updated.status}`,
            data: updated
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getCommissions(req, res) {
    try {
        const stats = await getCommissionStats();
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getProviderDetails(req, res) {
    try {
        const { providerId } = req.params;
        const details = await getProviderCommissionDetails(providerId);
        return res.status(200).json({
            success: true,
            data: details
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getUsers(req, res) {
    try {
        const users = await getAllUsersService();
        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function updateUserStatusController(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await updateUserStatus(id, status);
        return res.status(200).json({
            success: true,
            message: `User status updated to ${status}`,
            data: updated
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.reason || error.message
        });
    }
}

module.exports = {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    toggleAdminStatus,
    getCommissions,
    getProviderDetails,
    getUsers,
    updateUserStatus: updateUserStatusController
};
