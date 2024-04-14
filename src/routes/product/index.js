"use strict";

const express = require("express");
const route = express.Router();
const ProductController = require("../../controllers/product.controller.js");
const handleError = require("../../middlewares/error.handle");
const { checkAuthentication } = require("../../auth/checkauth.js");

route.use(handleError(checkAuthentication));
route.post("/product/create", handleError(ProductController.createProduct));

module.exports = route;
