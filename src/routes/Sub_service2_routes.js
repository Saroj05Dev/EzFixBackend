const express = require("express");
const router = express.Router();

const subService2Controller = require("../controllers/Sub_service2_controller");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");
const { upload } = require("../controllers/Sub_service2_controller");

router.post(
  "/",
  isAuthenticated,
  isAuthorized(["admin"]),
  upload.single("image"),
  subService2Controller.createSubService2
);

router.get(
  "/getall",
  subService2Controller.getAllSubService2
);

router.get(
  "/service/:serviceId",
  subService2Controller.getSubService2ByServiceId
);

router.get(
  "/:id",
  subService2Controller.getSubService2ById
);

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  upload.single("image"),
  subService2Controller.updateSubService2
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService2Controller.deleteSubService2
);

module.exports = router;
