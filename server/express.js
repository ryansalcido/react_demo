const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(routes);

module.exports = app;