"use strict";

const keyTokenModel = require("../models/keytoken.model.js");

class keyTokenService {
  static createKeyToken = async (userId, publicKey) => {
    try {
      const publicKeyString = publicKey.toString();
      const newKeyToken = await keyTokenModel.create({
        userId,
        publicKey: publicKeyString,
      });
      return newKeyToken ? newKeyToken.publicKey : null;
    } catch (error) {
      return {
        code: "SCE1",
        message: error.message,
        status: "ERROR",
      };
    }
  };
}

module.exports = keyTokenService;
