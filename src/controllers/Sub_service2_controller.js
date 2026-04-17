const SubService2Service = require("../services/SubService2_service");
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

const upload = multer({ storage: storage });

async function createSubService2(req, res) {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }

    if (req.body.price) {
      req.body.price = Number(req.body.price);
    }

    const data = req.body;
    const subService2 = await SubService2Service.createSubService2(data);

    return res.status(201).json({
      success: true,
      data: subService2,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getAllSubService2(req, res) {
  try {
    const data = await SubService2Service.getAllSubService2();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getSubService2ById(req, res) {
  try {
    const { id } = req.params;
    const data = await SubService2Service.getSubService2ById(id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getSubService2ByServiceId(req, res) {
  try {
    const { serviceId } = req.params;
    const data = await SubService2Service.getSubService2ByServiceId(serviceId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateSubService2(req, res) {
  try {
    const { id } = req.params;

    if (req.file) {
      req.body.image = req.file.path;
    }

    if (req.body.price) {
      req.body.price = Number(req.body.price);
    }

    const data = await SubService2Service.updateSubService2(id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteSubService2(req, res) {
  try {
    const { id } = req.params;
    const data = await SubService2Service.deleteSubService2(id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createSubService2,
  upload,
  getAllSubService2,
  getSubService2ById,
  getSubService2ByServiceId,
  updateSubService2,
  deleteSubService2,
};
