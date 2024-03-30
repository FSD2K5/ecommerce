const mongoose = require("mongoose");
const NAME_DOCUMENT = "keytoken";
const NAME_COLLECTION = "keyTokens";

var keyTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refeshTokenUsed: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: NAME_COLLECTION,
  }
);

//Export the model
module.exports = mongoose.model(NAME_COLLECTION, keyTokenSchema);
