"use strict";

const mongoose = require("mongoose");
const NAME_DOCUMENT = "Shop";
const NAME_COLLECTION = "Shops";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["inactive", "active"],
      default: "inactive",
    },
    verfify: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: NAME_COLLECTION,
  }
);

module.exports = mongoose.model(NAME_DOCUMENT, shopSchema);
