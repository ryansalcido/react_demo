require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const rootRouter = require("./routes");
const path = require("path");
const cookieParser = require("cookie-parser");

app.disable("x-powered-by");
app.use(cookieParser());

const port = 5000;

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use(express.json());

app.use("/react-demo/api", rootRouter);

const publicPath = path.join(__dirname, "build");
app.use("/react-demo/", express.static(publicPath));
app.use("/react-demo/*", express.static(publicPath));

app.listen(port, () => console.log(`Server running on port ${port}`));