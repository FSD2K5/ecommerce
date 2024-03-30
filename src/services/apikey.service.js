"use strict";

const apikeyModle = require("../models/apikey.model.js");
const cryto = require("node:crypto");

class ApiKeyService {
  static async findApiKey(apiKey) {
    const apiKeyDocument = await apikeyModle.findOne({ apiKey }).lean();
    return apiKeyDocument;
  }
  static async createApiKey(permissions) {
    const apiKey = await cryto.randomBytes(64).toString("hex");
    const newApiKey = await apikeyModle.create({
      apiKey,
      permissions,
    });
    return newApiKey;
  }
}

module.exports = ApiKeyService;
