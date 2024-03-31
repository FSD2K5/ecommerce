"use strict";

const shopModel = require("../models/shop.model.js");
const bcrypt = require("bcrypt");
const cryto = require("node:crypto");
const { createKeyToken } = require("./keytoken.service.js");
const { createToken } = require("../auth/auth.utils.js");
const { getInfo } = require("../utils/getInfo.js");
const { BadRequest } = require("../core/error.response.js");

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
    if (!newShop) {
      return {
        code: "SCE1",
        message: "Create shop fail !!!",
        status: "ERROR",
      };
    }
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
    const publicKeyString = await createKeyToken(newShop._id, publicKey);
    if (!publicKeyString) {
      return {
        code: "SCE1",
        message: "Create key token faild!!",
        status: "ERROR",
      };
    }
    // Step 6: create access token and refresh token
    const paylode = { userId: newShop._id, email: newShop.email };
    const { accessToken, refreshToken } = createToken(
      paylode,
      publicKeyString,
      privateKey
    );
    return {
      code: "SCS1",
      message: "SignUp shop Success",
      data: {
        shopInfo: getInfo(["name", "email"], newShop),
        accessToken,
        refreshToken,
      },
      status: "OK",
    };
  };
}

module.exports = AccessService;
