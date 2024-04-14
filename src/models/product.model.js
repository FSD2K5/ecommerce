"use strict";

const mongoose = require("mongoose");
const NAME_DOCUMENT = "Product";
const NAME_COLLECTION = "Products";

let productSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
    },
    productPrice: {
      type: String,
      require: true,
    },
    productQuality: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      enum: ["clothing", "electronic"],
      required: true,
    },
    productAttribute: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: NAME_COLLECTION,
  }
);

const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Clotings",
  }
);

const electronicSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    factory: {
      type: String,
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Electronis",
  }
);

//Export the model
module.exports = {
  productModel: mongoose.model(NAME_DOCUMENT, productSchema),
  clothingModel: mongoose.model("Clothing", clothingSchema),
  electronicModel: mongoose.model("electronic", electronicSchema),
};
