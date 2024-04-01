"use strict";

const shopModel = require("../models/shop.model");

class ShopService {
  static findByEmail = async ({
    email,
    select = { name: 1, email: 1, password: 1, verfify: 1, roles: 1 },
  }) => {
    const shop = await shopModel.findOne({ email }).select(select).lean();
    return shop;
  };
}

module.exports = ShopService;
