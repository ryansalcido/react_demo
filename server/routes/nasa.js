require("dotenv").config();
const express = require("express");
const nasaRouter = express.Router();
const axios = require("axios");

nasaRouter.get("/apod", (req, res) => {
	axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
		.then(response => {
			res.status(200).json({nasa: response.data, message: {msgBody: "Successfully retreived NASA data", msgError: false}});
		}).catch(error => {
			res.status(500).json({
				message: {msgBody: "Error occurred attepmting to retrieve NASA's picture of the day", msgError: true}
			});
		});
});

module.exports = nasaRouter;