"use strict";

const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");

function createToken(payload, publicKeyString, privateKey) {
  const publicKey = crypto.createPublicKey(publicKeyString);
  const accessToken = JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });
  const refreshToken = JWT.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });
  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      return {
        code: "ADE1",
        message: "Decode error",
      };
    }
    console.log("[V] :: decode ::", decode);
  });
  return { accessToken, refreshToken };
}

module.exports = {
  createToken,
};
