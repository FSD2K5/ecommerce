"use strict";

const mongoose = require("mongoose");
const {
  db: { host, port },
} = require("../configs/config.js");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(`mongodb://${host}:${port}`, { maxPoolSize: 50 })
      .then((_) => {
        console.log("Connect to database Suucess");
      })
      .catch((err) => {
        console.log("ERROR :: ", err);
      });
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getInstance();

module.exports = instance;
