"use strict";

const express = require("express");
const { checkApiKey, checkPermission } = require("../auth/checkauth");
const route = express.Router();
// Check Authorization
route.use(checkApiKey);
route.use(checkPermission("000"));
// route api
route.use("/v1/api", require("./access"));
module.exports = route;
