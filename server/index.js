require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const weatherRouter = require("./routes/weather");
const spotifyRouter = require("./routes/spotify");
const nasaRouter = require("./routes/nasa");
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

app.use("/user", userRouter);
app.use("/weather", weatherRouter);
app.use("/spotify", spotifyRouter);
app.use("/nasa", nasaRouter);

const publicPath = path.join(__dirname, "build");
app.use(express.static(publicPath));
app.use("*", express.static(publicPath));

app.listen(port, () => console.log(`Server running on port ${port}`));