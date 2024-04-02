"use strict";

const { Types } = require("mongoose");
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

  static findKeyStoreByUserId = async (userId) => {
    const keyStore = await keyTokenModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean();
    return keyStore;
  };

  static deleteKeyToken = async (userId) => {
    await keyTokenModel.deleteOne({ userId: new Types.ObjectId(userId) });
  };

  static findRefreshTokenUsed = async (refreshToken) => {
    const keyStore = await keyTokenModel.find({
      refreshTokenUsed: refreshToken,
    });
    return keyStore;
  };

  static findRefreshToken = async (refreshToken) => {
    const keyStore = await keyTokenModel.findOne({ refreshToken }).lean();
    return keyStore;
  };

  static updateRefreshTokenUsed = async ({
    userId,
    refreshToken,
    newRefreshToken,
  }) => {
    const filter = { userId: new Types.ObjectId(userId) };
    const keyTokenUpdate = await keyTokenModel.updateOne(filter, {
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
      $set: {
        refreshToken: newRefreshToken,
      },
    });
    return keyTokenUpdate;
  };
}

module.exports = keyTokenService;
