"use strict";

const shopModel = require("../models/shop.model.js");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { createKeyToken } = require("./keytoken.service.js");
const { createToken, verifyToken } = require("../auth/auth.utils.js");
const { getInfo } = require("../utils/getInfo.js");
const { BadRequest } = require("../core/error.response.js");
const ShopService = require("./shop.service.js");
const keyTokenService = require("./keytoken.service.js");
const generateKeys = require("../utils/generateKeys.js");
const ROLES = {
  SHOP: "001",
  WRTTOR: "002",
  EDITOR: "003",
  ADMIN: "004",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // Step 1: Check email in Database
    const holderEmail = await shopModel.findOne({ email }).lean();
    if (holderEmail)
      throw new BadRequest({ message: "Email already register!!!" });
    // Step 2: Hash Password
    const hashPassword = await bcrypt.hash(password, 10);
    // Step 3: create a shop
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: ROLES.SHOP,
    });
    if (!newShop) throw new BadRequest({ message: "Signup shop Fail !!" });
    // Step 4: create a public yey and private key for new shop
    const { publicKey, privateKey } = generateKeys();
    const publicKeyString = await createKeyToken({
      userId: newShop._id,
      publicKey,
      refreshToken: null,
    });
    if (!publicKeyString)
      throw new BadRequest({ message: "Public Key invalid !!!" });
    // Step 6: create access token and refresh token
    const paylode = {
      userId: newShop._id,
      name: newShop.name,
      email: newShop.email,
    };
    const { accessToken, refreshToken } = createToken(
      paylode,
      publicKeyString,
      privateKey
    );
    return {
      shopInfo: getInfo(["_id", "name", "email"], newShop),
      accessToken,
      refreshToken,
    };
  };

  static login = async ({ email, password }) => {
    // Step 1: Check email
    const shop = await ShopService.findByEmail({ email });
    if (!shop) throw new BadRequest({ message: "Shop invalid 1!!!" });
    // Step 2: check password
    const match = await bcrypt.compare(password, shop.password);
    if (!match) throw new BadRequest({ message: "Shop invalid 2!!!" });
    // Step 3: create public key and private key
    const { publicKey, privateKey } = generateKeys();
    // Step 4: create Acces token and refresh token
    const payload = {
      userId: shop._id,
      name: shop.name,
      email: shop.email,
    };
    const publicKeyString = publicKey.toString();
    const tokenPair = createToken(payload, publicKeyString, privateKey);
    if (!tokenPair) throw new BadRequest({ message: "Login Fail !!! " });
    // Step 5: Update keyToken by user id
    const keyStore = await keyTokenService.createKeyToken({
      userId: shop._id,
      publicKey,
      refreshToken: tokenPair.refreshToken,
    });
    if (!keyStore) throw new BadRequest({ message: "Login fail !!!" });
    return {
      shopInfo: getInfo(["_id", "name", "email"], shop),
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  };

  static logout = async ({ keyStore }) => {
    await keyTokenService.deleteKeyToken(keyStore.userId);
    return {
      description: "Deleted Success",
    };
  };

  static handleRefreshToken = async ({ refreshtoken }) => {
    const keyToken = await keyTokenService.findByRefreshTokenUsed(refreshtoken);
    console.log(keyToken);
    // Case 1: Refresh token exists in refreshTokenUsed
    if (keyToken) {
      // Step 1: decode refreshToken
      const decode = verifyToken(refreshtoken, keyToken.publicKey);
      // Step 2: delete keyStore of User
      await keyTokenService.deleteKeyToken(decode.userId);
      throw new BadRequest({ message: "Warning !!!" });
    }
    // Case 2: Refresh token don't exists in refreshTokenUsed
    // Step 1: find refreshtoken in KeyToken collection
    const holderShop = await keyTokenService.findRefreshToken(refreshtoken);
    if (!holderShop) throw new BadRequest({ message: "Shop not found !!" });
    // Step 2: decode refreshtoken
    const { userId, name, email } = verifyToken(
      refreshtoken,
      holderShop.publicKey
    );
    // Step 3: create new accessToken and refreshtoken
    const { publicKey, privateKey } = generateKeys();
    const publicKeyString = publicKey.toString();
    const tokenPair = createToken(
      { userId, name, email },
      publicKeyString,
      privateKey
    );
    // Step 4: update Public Key
    await keyTokenService.updatePublicKey({
      userId: userId,
      publicKeyString,
    });
    // Step 5: update refreshTokenUsed and refreshtoken of shop
    await keyTokenService.updateRefreshTokenUsed({
      userId,
      refreshToken: refreshtoken,
      newRefreshToken: tokenPair.refreshToken,
    });

    return {
      tokenPair,
    };
  };
}

module.exports = AccessService;
