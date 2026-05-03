const SubService3Repository = require("../repositories/Sub_service3_repository");

async function createSubService3(data) {
  const {
    subService3Name,
    image,
    price,
    description,
    serviceId,
    subServiceId,
    subService1Id,
    subService2Id,
  } = data;

  if (
    !subService3Name ||
    price === undefined ||
    !description ||
    !serviceId ||
    !subServiceId ||
    !subService1Id ||
    !subService2Id
  ) {
    throw new Error("All fields are required");
  }


  return await SubService3Repository.createSubService3(data);
}

async function getSubService3ById(id) {
  return await SubService3Repository.getSubService3ById(id);
}

async function getAllSubService3() {
  return await SubService3Repository.getAllSubService3();
}

async function getSubService3ByServiceId(serviceId) {
  return await SubService3Repository.getSubService3ByServiceId(serviceId);
}

async function updateSubService3(id, data) {
  return await SubService3Repository.updateSubService3(id, data);
}

async function deleteSubService3(id) {
  return await SubService3Repository.deleteSubService3(id);
}

module.exports = {
  createSubService3,
  getSubService3ById,
  getAllSubService3,
  getSubService3ByServiceId,
  updateSubService3,
  deleteSubService3,
};
