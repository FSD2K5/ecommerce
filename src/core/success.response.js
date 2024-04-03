"use strict";

const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode");
class SuccessResponse {
  constructor({ message, statusCode, metadata = {} }) {
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
  send(res) {
    return res.status(200).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({
    message = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
    metadata,
  }) {
    super({ message, statusCode, metadata });
  }
}

class Created extends SuccessResponse {
  constructor({
    message = ReasonPhrases.CREATED,
    statusCode = StatusCodes.CREATED,
    metadata,
  }) {
    super({ message, statusCode, metadata });
  }
}

module.exports = {
  OK,
  Created,
};
