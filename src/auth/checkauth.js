"use strict";

const ApiKeyService = require("../services/apikey.service");

const HEADERS = {
  APIKEY: "x-api-key",
};

const checkApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers[HEADERS.APIKEY]?.toString();
    if (!apiKey) {
      return res.status(400).json({
        code: "AFE1",
        message: "Not Found Api Key",
        status: "ERROR",
      });
    }
    const apiKeyDocument = await ApiKeyService.findApiKey(apiKey);
    if (!apiKeyDocument) {
      return res.status(400).json({
        code: "AFE1",
        message: "Not Found Api Key",
        status: "ERROR",
      });
    }
    req.objectKey = apiKeyDocument;
    next();
  } catch (error) {
    return res.status(400).json({
      code: "AEE1",
      message: error.message,
      status: "ERROR",
    });
  }
};

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const permissions = req.objectKey.permissions;
    if (!permissions) {
      return res.status(300).json({
        code: "AFE2",
        message: "Not Found Permission",
        status: "ERROR",
      });
    }
    const isFind = permissions.includes(permission);
    if (!isFind) {
      return res.status.json({
        code: "AIE2",
        message: "Permission invalid",
        status: "ERROR",
      });
    }
    next();
  };
};

module.exports = {
  checkApiKey,
  checkPermission,
};
