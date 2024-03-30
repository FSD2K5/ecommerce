const mongoose = require("mongoose");

const NAME_DOCUMENT = "apikey";
const NAME_COLLECTION = "apikeys";

var apikeySchema = new mongoose.Schema(
  {
    apiKey: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    permissions: {
      type: [String],
      enum: ["000", "001", "002"],
      required: true,
    },
  },
  {
    collection: NAME_COLLECTION,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(NAME_DOCUMENT, apikeySchema);
