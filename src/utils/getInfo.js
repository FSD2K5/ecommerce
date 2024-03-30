"use strict";

const _ = require("lodash");

const getInfo = function (fields = [], object = {}) {
  return _.pick(object, fields);
};

module.exports = {
  getInfo,
};
