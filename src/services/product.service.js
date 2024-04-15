"use strict";

const { BadRequest } = require("../core/error.response.js");
const {
  productModel,
  clothingModel,
  electronicModel,
} = require("../models/product.model.js");

class ProductFactory {
  static async createNewProduct({ type, payload, shopId }) {
    switch (type) {
      case "electronic":
        return await new Electronic(payload).createProductElectronic(shopId);
      case "clothing":
        return await new Clothing(payload).createProductColthing(shopId);
      default:
        throw new BadRequest({ message: "Type product dont exisit !!!" });
    }
  }
}

class Product {
  constructor({
    productName,
    productDescription,
    productPrice,
    productQuality,
    productType,
    productAttribute,
  }) {
    this.productName = productName;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productQuality = productQuality;
    this.productType = productType;
    this.productAttribute = productAttribute;
  }

  async createProduct(id, shopId) {
    const newProduct = await productModel.create({ ...this, _id: id, shopId });
    return newProduct;
  }
}

class Clothing extends Product {
  async createProductColthing(shopId) {
    const newAttribute = await clothingModel.create({
      ...this.productAttribute,
      shopId: shopId,
    });
    if (!newAttribute)
      throw new BadRequest({ message: "create product fail!!!" });
    const newProduct = await super.createProduct(newAttribute._id, shopId);
    if (!newProduct) throw new BadRequest({ message: "Create product Error" });
    return newProduct;
  }
}

class Electronic extends Product {
  async createProductElectronic(shopId) {
    const newAttribute = await electronicModel.create({
      ...this.productAttribute,
      shopId: shopId,
    });
    if (!newAttribute)
      throw new BadRequest({ message: "create product fail!!!" });
    const newProduct = await super.createProduct(newAttribute._id, shopId);
    if (!newProduct) throw new BadRequest({ message: "Create product Error" });
    return newProduct;
  }
}

module.exports = ProductFactory;
