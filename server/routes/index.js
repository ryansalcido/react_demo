const rootRouter = require("express").Router();
const userRouter = require("./user");
const weatherRouter = require("./weather");
const spotifyRouter = require("./spotify");
const nasaRouter = require("./nasa");

rootRouter.use("/user", userRouter);
rootRouter.use("/weather", weatherRouter);
rootRouter.use("/spotify", spotifyRouter);
rootRouter.use("/nasa", nasaRouter);


module.exports = rootRouter;