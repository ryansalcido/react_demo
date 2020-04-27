require("dotenv").config();
const express = require("express");
const weatherRouter = express.Router();
const City = require("../models/City");
const axios = require("axios");
const passport = require("passport");
const passportConfig = require("../config/passport");
const STATE_UTILS = require("states-utils");

const toProperCase = (str) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

weatherRouter.post("/forecast", passport.authenticate("jwt", {session: false}), (req, res) => {
	const { location } = req.body;
	
	const parsedLocation = location.split(",");
	var normalizedLocation = location;
	if(parsedLocation.length === 2) { //If state is in the US, append US to the end of the location query
		normalizedLocation += STATE_UTILS.isUSAState(parsedLocation[1].trim()) ? ",US" : "";
	}
	axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${normalizedLocation}&appid=${process.env.OWM_API_KEY}&units=imperial`)
		.then(owmRes => {
			var city = City.findOne({id: owmRes.data.city.id}).exec();
			city.then(doc => {
				var location = toProperCase(parsedLocation[0] ? parsedLocation[0].trim() : doc.name);
				if(doc.state !== "") {
					location += `, ${doc.state}`;
				}
				if(doc.country !== "") {
					location += `, ${doc.country}`;
				}
				res.status(200).json({location, weatherForecast: owmRes.data, message: {msgBody: "Successfully retrieved weather forecast", msgError: false}});
			}).catch(err => {
				//City database lookup is enrichment, so it is not a requirement for "success"
				res.status(200).json({location: normalizedLocation, weatherForecast: owmRes.data, message: {msgBody: "Successfully retrieved weather forecast", msgError: false}});
			});
		}).catch(err => {
			if(err.response) {
				const { cod, message } = err.response.data;
				if(cod && message) {
					res.status(cod).json({
						message: {
							msgBody: "Unable to find weather information for given city. Please try a different search criteria.", 
							msgError: true
						}
					});
				} else {
					res.status(500).json({message: "Error occurred querying for weather forecast", msgError: true});
				}
			} else {
				res.status(500).json({message: "Error occurred querying for weather forecast", msgError: true});
			}
		});
});

module.exports = weatherRouter;