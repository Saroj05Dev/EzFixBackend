const notificationRepository = require("../repositories/notification_repository");

async function notifyNewBooking(booking, providerId) {
    return await notificationRepository.createNotification({
        recipient: providerId,
        sender: booking.customer_id,
        title: "New Booking Request",
        message: `You have a new booking request for your service.`,
        bookingId: booking._id,
        type: "booking_new",
    });
}

async function notifyBookingStatusUpdate(booking, recipientId, status) {
    let title = "";
    let message = "";
    let type = "";

    if (status === "Confirmed") {
        title = "Booking Confirmed";
        message = "Your booking has been confirmed by the provider.";
        type = "booking_confirmed";
    } else if (status === "Completed") {
        title = "Booking Completed";
        message = "Your service has been marked as completed.";
        type = "booking_completed";
    } else if (status === "Cancelled") {
        title = "Booking Cancelled";
        message = "A booking has been cancelled.";
        type = "booking_cancelled";
    }

    return await notificationRepository.createNotification({
        recipient: recipientId,
        sender: booking.provider_id,
        title,
        message,
        bookingId: booking._id,
        type,
    });
}

async function getUserNotifications(userId) {
    return await notificationRepository.getUserNotifications(userId);
}

async function markNotificationAsRead(id) {
    return await notificationRepository.markAsRead(id);
}

async function markAllNotificationsAsRead(userId) {
    return await notificationRepository.markAllAsRead(userId);
}

async function getUnreadNotificationCount(userId) {
    return await notificationRepository.getUnreadCount(userId);
}

async function deleteNotification(id) {
    return await notificationRepository.deleteNotification(id);
}

module.exports = {
    notifyNewBooking,
    notifyBookingStatusUpdate,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    deleteNotification,
};
