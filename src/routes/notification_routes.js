const express = require("express");
const { getNotifications, markRead, getUnreadCount, deleteNotification } = require("../controllers/notification_controller");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.get("/unread-count", isAuthenticated, getUnreadCount);
router.put("/:id/read", isAuthenticated, markRead);
router.delete("/:id", isAuthenticated, deleteNotification);

module.exports = router;
