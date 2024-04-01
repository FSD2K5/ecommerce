"use strict";

const keyTokenModel = require("../models/keytoken.model.js");

class keyTokenService {
  static createKeyToken = async ({ userId, publicKey, refreshToken }) => {
    const publicKeyString = publicKey.toString();
    const filter = { userId };
    const update = {
      publicKey: publicKeyString,
      refreshToken,
      refreshTokenUsed: [],
    };
    const newKeyToken = await keyTokenModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
    return newKeyToken ? newKeyToken.publicKey : null;
  };
}

module.exports = keyTokenService;
