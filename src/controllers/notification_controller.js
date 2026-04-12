const notificationService = require("../services/notification_service");

async function getNotifications(req, res) {
    try {
        const notifications = await notificationService.getUserNotifications(req.user.id);
        return res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function markRead(req, res) {
    try {
        const notification = await notificationService.markNotificationAsRead(req.params.id);
        return res.status(200).json({ success: true, data: notification });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function getUnreadCount(req, res) {
    try {
        const count = await notificationService.getUnreadNotificationCount(req.user.id);
        return res.status(200).json({ success: true, data: count });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function deleteNotification(req, res) {
    try {
        await notificationService.deleteNotification(req.params.id);
        return res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
module.exports = {
    getNotifications,
    markRead,
    getUnreadCount,
    deleteNotification,
};
