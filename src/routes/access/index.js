"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const handleError = require("../../middlewares/error.handle");
const { checkAuthentication } = require("../../auth/checkauth.js");

const route = express.Router();

route.post("/shop/signup", handleError(AccessController.signUp));
route.post("/shop/login", handleError(AccessController.login));
// check Authentication
route.use(handleError(checkAuthentication));

// logout
route.post("/shop/logout", handleError(AccessController.logout));
route.post(
  "/shop/handle_refreshtoken",
  handleError(AccessController.handleRefreshToken)
);
module.exports = route;
