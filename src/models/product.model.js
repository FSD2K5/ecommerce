"use strict";

const mongoose = require("mongoose");
const slugify = require("slugify");
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
    productThumb: {
      type: String,
    },
    productDescription: {
      type: String,
    },
    productPrice: {
      type: Number,
      require: true,
    },
    productQuality: {
      type: Number,
      required: true,
    },
    productVarition: {
      type: Array,
      default: [],
    },
    productSlug: {
      type: String,
    },
    productRating: {
      type: Number,
      default: 4.5,
      min: [1.0, "Rating must be above 1.0"],
      max: [5.0, "Rating must be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
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

// Middleware
productSchema.pre("save", function (next) {
  this.productSlug = slugify(this.productName, { lower: true });
  next();
});

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
