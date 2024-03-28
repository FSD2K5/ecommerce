const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const dotenv = require("dotenv");

const app = express();
// Initial middleware
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
dotenv.config();
// Connect Database
require("./database/init.database.js");

// Setup routing
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Start build project",
    metadata: "Hello world".repeat(100000),
  });
});
// Handling error

module.exports = app;
