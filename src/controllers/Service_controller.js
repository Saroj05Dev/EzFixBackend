const ServiceService = require("../services/Service_services");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

async function createService(req, res) {
  try {
    if (req.file) {
      const imageUrl = await uploadToCloudinary(
        req.file.path,
        "fixerly/services",
      );
      req.body.image = imageUrl;
    }

    // Keep price as string to support ranges like "400-500"
    if (req.body.price) {
      req.body.price = String(req.body.price).trim();
    }

    const service = await ServiceService.createService(req.body);

    return res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const service = await ServiceService.getServiceById(id);
    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllServices(req, res) {
  try {
    const services = await ServiceService.getAllServices();
    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateService(req, res) {
  try {
    const { id } = req.params;

    if (req.file) {
      const imageUrl = await uploadToCloudinary(
        req.file.path,
        "fixerly/services",
      );
      req.body.image = imageUrl;
    }

    // Keep price as string to support ranges like "400-500"
    if (req.body.price) {
      req.body.price = String(req.body.price).trim();
    }

    const service = await ServiceService.updateService(id, req.body);

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const service = await ServiceService.deleteService(id);
    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
  upload,
};
