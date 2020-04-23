require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const port = 5000;

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use(express.json());

// app.use(express.static(path.join(__dirname, "build")));
app.use("/user", userRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));