"use strict";

const ApiKeyService = require("../services/apikey.service");
const { UnAthorizedError } = require("../core/error.response.js");
const { findKeyStoreByUserId } = require("../services/keytoken.service.js");
const { verifyToken } = require("./auth.utils.js");

const HEADERS = {
  APIKEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHENTICATION: "authentication",
};

const checkApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers[HEADERS.APIKEY]?.toString();
    if (!apiKey) throw new UnAthorizedError({ message: "API KEY ERROR" });
    const apiKeyDocument = await ApiKeyService.findApiKey(apiKey);
    if (!apiKeyDocument)
      throw new UnAthorizedError({ message: "API KEY ERROR" });
    req.objectKey = apiKeyDocument;
    next();
  } catch (error) {
    throw new UnAthorizedError({ message: "CHECK API KEY ERROR" });
  }
};

const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const permissions = req.objectKey.permissions;
      if (!permissions)
        throw new UnAthorizedError({ message: "PERMISSION ERROR" });
      const isFind = permissions.includes(permission);
      if (!isFind) throw new UnAthorizedError({ message: "PERMISSION ERROR" });
      next();
    } catch (error) {
      throw new UnAthorizedError({ message: "CHECK PERMISSION ERROR" });
    }
  };
};

const checkAuthentication = async (req, res, next) => {
  // Step 1: check userId
  const userId = req.headers[HEADERS.CLIENT_ID];
  if (!userId) throw new UnAthorizedError({ message: "Missing UserId !!!" });
  // Step 2: find KeyStore by userID
  const keyStore = await findKeyStoreByUserId(userId);
  if (!keyStore) throw new UnAthorizedError({ message: "User Error !!!" });
  // Step 3: check accessToken
  const accessToken = req.headers[HEADERS.AUTHENTICATION];
  if (!accessToken)
    throw new UnAthorizedError({ message: "Missing AccessToken !!!" });
  // Step 4: verify accessToken
  try {
    const decode = await verifyToken(accessToken, keyStore.publicKey);
    // Step 5: check userId in header and userId in decode
    if (userId != decode.userId)
      throw new UnAthorizedError({ message: "Authorized error !!!" });
    // next
    req.keyStore = keyStore;
    next();
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = {
  checkApiKey,
  checkPermission,
  checkAuthentication,
};
