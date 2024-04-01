const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const dotenv = require("dotenv");

const app = express();
// Initial middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
dotenv.config();
// Connect Database
require("./database/init.database.js");

// Setup routing
app.use("", require("./routes"));
// Handling error
app.use((req, res, next) => {
  const error = new Error("NOT FOUND");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    code: "AFE1",
    message: error.message || "server invalid",
    status: statusCode,
  });
});

module.exports = app;
