"use strict";

const development = {
  app: {
    host: process.env.APP_DEV_HOST || 3030,
  },
  db: {
    host: process.env.DB_DEV_HOST || "localhost",
    port: process.env.DB_DEV_PORT || 27017,
    name: process.env.DB_DEV_NAME || "shopDev",
  },
};

const product = {
  app: {
    host: process.env.APP_PRO_HOST || 3050,
  },
  db: {
    host: process.env.DB_PRO_HOST || "localhost",
    port: process.env.DB_PRO_HOST || 27017,
    name: process.env.DB_PRO_HOST || "shopPro",
  },
};

const config = { development, product };
const env = process.env.NODE_ENV || "development";
module.exports = config[env];
