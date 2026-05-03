const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subService3Schema = new Schema(
  {
    subService3Name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },

    price: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    subServiceId: {
      type: Schema.Types.ObjectId,
      ref: "SubService",
      required: true,
    },

    subService1Id: {
      type: Schema.Types.ObjectId,
      ref: "SubService1",
      required: true,
    },

    subService2Id: {
      type: Schema.Types.ObjectId,
      ref: "SubService2",
      required: true,
    },
  },
  { timestamps: true }
);

const SubService3 = mongoose.model("SubService3", subService3Schema);
module.exports = SubService3;
