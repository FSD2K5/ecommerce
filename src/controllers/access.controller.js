"use strict";

const { OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  static signUp = async (req, res, next) => {
    new OK({
      message: "Register Success",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
  static login = async (req, res, next) => {
    new OK({
      message: "Login Success",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  static logout = async (req, res, next) => {
    new OK({
      message: "Logout Success",
      metadata: await AccessService.logout(req),
    }).send(res);
  };
}

module.exports = AccessController;
