"use strict";

const shopModel = require("../models/shop.model.js");
const bcrypt = require("bcrypt");
const cryto = require("node:crypto");
const { createKeyToken } = require("./keytoken.service.js");
const { createToken } = require("../auth/auth.utils.js");
const { getInfo } = require("../utils/getInfo.js");
const { BadRequest } = require("../core/error.response.js");
const ShopService = require("./shop.service.js");
const keyTokenService = require("./keytoken.service.js");
const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");
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
    if (holderEmail) throw new BadRequest("Email already register!!!");
    // Step 2: Hash Password
    const hashPassword = await bcrypt.hash(password, 10);
    // Step 3: create a shop
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: ROLES.SHOP,
    });
    if (!newShop) throw new BadRequest("Signup shop Fail !!");
    // Step 4: create a public yey and private key for new shop
    const { publicKey, privateKey } = cryto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    const publicKeyString = await createKeyToken({
      userId: newShop._id,
      publicKey,
      refreshToken: null,
    });
    if (!publicKeyString) throw new BadRequest("Public Key invalid !!!");
    // Step 6: create access token and refresh token
    const paylode = { userId: newShop._id, email: newShop.email };
    const { accessToken, refreshToken } = createToken(
      paylode,
      publicKeyString,
      privateKey
    );
    return {
      shopInfo: getInfo(["name", "email"], newShop),
      accessToken,
      refreshToken,
    };
  };

  static login = async ({ email, password }) => {
    // Step 1: Check email
    const shop = await ShopService.findByEmail({ email });
    if (!shop) throw new BadRequest("Shop invalid 1!!!");
    // Step 2: check password
    const match = await bcrypt.compare(password, shop.password);
    if (!match) throw new BadRequest("Shop invalid 2!!!");
    // Step 3: create public key and private key
    const { publicKey, privateKey } = cryto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    // Step 4: create Acces token and refresh token
    const payload = {
      userId: shop._id,
      name: shop.name,
      email: shop.email,
    };
    const publicKeyString = publicKey.toString();
    const tokenPair = createToken(payload, publicKeyString, privateKey);
    if (!tokenPair) throw new BadRequest("Login Fail !!! ");
    // Step 5: Update keyToken by user id
    const keyStore = await keyTokenService.createKeyToken({
      userId: shop._id,
      publicKey,
      refreshToken: tokenPair.refreshToken,
    });
    if (!keyStore) throw new BadRequest("Login fail !!!");
    return {
      shopInfo: getInfo(["name", "email"], shop),
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  };

  static logout = async ({ keyStore }) => {
    await keyTokenService.deleteKeyToken(keyStore.userId);
    return {
      data: "Deleted Success",
    };
  };
}

module.exports = AccessService;
