"use strict";

const mongoose = require("mongoose");
const URL_MONGODB = process.env.URL_MONGODB;

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(URL_MONGODB, { maxPoolSize: 50 })
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
