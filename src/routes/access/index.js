"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const handleError = require("../../middlewares/error.handle");
const route = express.Router();

route.post("/shop/signup", handleError(AccessController.signUp));

module.exports = route;
