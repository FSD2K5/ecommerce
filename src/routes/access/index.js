"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const handleError = require("../../middlewares/error.handle");
const route = express.Router();

route.post("/shop/signup", handleError(AccessController.signUp));
route.post("/shop/login", handleError(AccessController.login));
module.exports = route;
