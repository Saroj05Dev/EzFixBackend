const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const upload = require("../middlewares/multerMiddleware");

// Route handling
router.get("/", settingsController.getSettings);
router.post("/", upload.single("logo"), settingsController.updateSettings);
router.put("/", upload.single("logo"), settingsController.updateSettings);

module.exports = router;
