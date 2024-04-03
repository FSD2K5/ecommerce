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
  JWT.verify(accessToken, publicKey, (error, decode) => {
    if (error) {
      throw error;
    }
    console.log("[V] :: decode ::", decode);
  });
  return { accessToken, refreshToken };
}

function verifyToken(token, publicKeyString) {
  const publicKey = crypto.createPublicKey(publicKeyString);
  try {
    const decode = JWT.verify(token, publicKey);
    return decode;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createToken,
  verifyToken,
};
