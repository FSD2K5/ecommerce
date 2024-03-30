"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const route = express.Router();

route.post("/shop/signup", AccessController.signUp);

module.exports = route;
