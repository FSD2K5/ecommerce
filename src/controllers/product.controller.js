"use strict";

const { Created } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  static async createProduct(req, res, next) {
    return new Created({
      message: "create product success!!",
      metadata: await ProductService.createNewProduct({
        type: req.body.productType,
        payload: req.body,
        shopId: req.userId,
      }),
    }).send(res);
  }
}

module.exports = ProductController;
