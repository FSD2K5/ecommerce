"use strict";

const ApiKeyService = require("../services/apikey.service");
const { BadRequest } = require("../core/error.response.js");
const { findKeyStoreByUserId } = require("../services/keytoken.service.js");
const JWT = require("jsonwebtoken");
const cryto = require("node:crypto");

const HEADERS = {
  APIKEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHENTICATION: "authentication",
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

const checkAuthentication = async (req, res, next) => {
  // Step 1: check userId
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) throw new BadRequest("Missing UserId !!!");
  // Step 2: find KeyStore by userID
  const keyStore = await findKeyStoreByUserId(userId);
  if (!keyStore) throw new BadRequest("User dont register !!");
  // Step 3: check accessToken
  const accessToken = req.headers[HEADERS.AUTHENTICATION];
  if (!accessToken) throw new BadRequest("Missing AccessToken !!!");
  // Step 4: verify accessToken
  try {
    const publicKey = await cryto.createPublicKey(keyStore.publicKey);
    const decode = JWT.verify(accessToken, publicKey);
    if (!decode) throw new BadRequest("Decode null!!");
    // Step 5: check userId in header and userId in decode
    if (userId != decode.userId) throw new BadRequest("Decode error !!!");
    console.log(decode.userId);
    // next
    req.keyStore = keyStore;
    next();
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = {
  checkApiKey,
  checkPermission,
  checkAuthentication,
};
