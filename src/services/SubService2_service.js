const SubService2Repository = require("../repositories/Sub_service2_repository");

async function createSubService2(data) {
  const {
    name,
    image,
    price,
    description,
    serviceId,
    subServiceId,
    subService1Id,
  } = data;

  if (
    !name ||
    !image ||
    price === undefined ||
    !description ||
    !serviceId ||
    !subServiceId ||
    !subService1Id
  ) {
    throw new Error("All fields are required");
  }

  if (typeof price !== "number") {
    throw new Error("Price must be a number");
  }

  return await SubService2Repository.createSubService2(data);
}

async function getSubService2ById(id) {
  return await SubService2Repository.getSubService2ById(id);
}

async function getAllSubService2() {
  return await SubService2Repository.getAllSubService2();
}

async function getSubService2ByServiceId(serviceId) {
  return await SubService2Repository.getSubService2ByServiceId(serviceId);
}

async function updateSubService2(id, data) {
  return await SubService2Repository.updateSubService2(id, data);
}

async function deleteSubService2(id) {
  return await SubService2Repository.deleteSubService2(id);
}

module.exports = {
  createSubService2,
  getSubService2ById,
  getAllSubService2,
  getSubService2ByServiceId,
  updateSubService2,
  deleteSubService2,
};
