const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subService2Schema = new Schema(
  {
    name: {
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
  },
  { timestamps: true }
);

const SubService2 = mongoose.model("SubService2", subService2Schema);
module.exports = SubService2;
