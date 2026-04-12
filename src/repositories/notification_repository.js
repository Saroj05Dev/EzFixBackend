const Notification = require("../schema/notification_schema");

async function createNotification(data) {
    return await Notification.create(data);
}

async function getUserNotifications(userId) {
    return await Notification.find({ recipient: userId })
        .populate({
            path: 'bookingId',
            populate: [
                {
                    path: 'service_id',
                    populate: [
                        { path: 'serviceId', select: 'name' },
                        { path: 'subServiceId', select: 'name' }
                    ]
                },
                { path: 'customer_id', select: 'name' }
            ]
        })
        .populate('sender', 'name')
        .sort({ createdAt: -1 });
}

async function markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
}

async function getUnreadCount(userId) {
    return await Notification.countDocuments({ recipient: userId, isRead: false });
}

async function deleteNotification(notificationId) {
    return await Notification.findByIdAndDelete(notificationId);
}

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    getUnreadCount,
    deleteNotification,
};
