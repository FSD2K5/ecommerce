"use strict";
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode.js");

class ErrorResponse extends Error {
  constructor({ message, status }) {
    super(message);
    this.status = status;
  }
}

class BadRequest extends ErrorResponse {
  constructor({
    message = ReasonPhrases.BAD_REQUEST,
    status = StatusCodes.BAD_REQUEST,
  }) {
    super({ message, status });
  }
}

class FobiddenError extends ErrorResponse {
  constructor({
    message = ReasonPhrases.FORBIDDEN,
    status = StatusCodes.FORBIDDEN,
  }) {
    super({ message, status });
  }
}

class UnAthorizedError extends ErrorResponse {
  constructor({
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED,
  }) {
    super({ message, status });
  }
}

class ConflictError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status);
  }
}

module.exports = {
  BadRequest,
  FobiddenError,
  UnAthorizedError,
  ConflictError,
};
