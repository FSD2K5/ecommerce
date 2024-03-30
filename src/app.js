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

module.exports = app;
