"use strict";

const mongoose = require("mongoose");
const os = require("os");
const SECONDE = 5000;

const countConnect = function () {
  const connections = mongoose.connections.length;
  console.log(`Number of connection :: ${connections}`);
};

const checkOverLoading = function () {
  setInterval(() => {
    const connections = mongoose.connections.length;
    const numCpu = os.cpus().length;
    const memoryUse = process.memoryUsage().rss;
    const maxConnect = numCpu * 5;
    if (connections > maxConnect) {
      console.log("Server overload connnection");
    }
    console.log(`Number of connection :: ${connections}`);
    console.log(`Memory usage :: ${memoryUse / 1024 / 1024} MB`);
  }, SECONDE);
};

module.exports = { countConnect, checkOverLoading };
